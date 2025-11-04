"use server";

import { VerificationRequestEmail } from "@/src/emails/verification-request";
import { getResendClient } from "@/src/lib/resend";
import {
  createServerSupabaseClient,
  getOrganizationProfile,
} from "@/src/lib/supabase/server";
import { render } from "@react-email/components";
import { VERIFICATION_BUCKET } from "@/src/lib/constants";
import { ActionResponse } from "@/src/types/actions-types";
import { revalidatePath } from "next/cache";
import slugify from "slugify";

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB limit

interface VerificationRequestData {
  documentBase64: string;
  documentName: string;
  documentType: string;
}

/**
 * Submits a verification request for the organization to be verified.
 *
 * @param data the data needed for the org to be verified
 * @returns result of the action, if successful or error message
 */
export async function submitVerificationRequest(
  data: VerificationRequestData,
): Promise<ActionResponse> {
  try {
    const supabase = await createServerSupabaseClient();

    // Get current user
    const organization = await getOrganizationProfile();

    if (!organization) {
      return {
        success: false,
        error: "You must be logged in to submit a verification request",
      };
    }

    // Check if already verified
    if (organization.is_verified) {
      return {
        success: false,
        error: "Your organization is already verified",
      };
    }

    // Get organization contact info from separate table
    const { data: contactInfo, error: contactError } = await supabase
      .from("organization_contact_info")
      .select("*")
      .eq("organization_id", organization.user_id)
      .single();

    if (contactError || !contactInfo) {
      return {
        success: false,
        error: "Organization contact information not found",
      };
    }

    // Validate file size (base64 is ~33% larger than original)
    const approximateFileSize = (data.documentBase64.length * 3) / 4;
    if (approximateFileSize > MAX_FILE_SIZE) {
      return {
        success: false,
        error: "Document size exceeds 1MB limit. Please upload a smaller file.",
      };
    }

    // Validate file type
    if (data.documentType !== "application/pdf") {
      return {
        success: false,
        error: "Only PDF documents are allowed",
      };
    }

    // Get all requests for this organization
    const { data: allRequests, error: requestsError } = await supabase
      .from("organization_verification_requests")
      .select("id, document_path, status, submitted_at")
      .eq("organization_id", organization.user_id)
      .order("submitted_at", { ascending: false });

    if (requestsError) {
      console.error("Failed to fetch existing requests:", requestsError);
      return {
        success: false,
        error: "Failed to check existing requests. Please try again.",
      };
    }

    const requests = allRequests || [];
    const pendingRequests = requests.filter((r) => r.status === "pending");
    const cancelledRequests = requests.filter((r) => r.status === "cancelled");

    // Calculate total attempts used (pending + cancelled)
    const totalAttempts = pendingRequests.length + cancelledRequests.length;

    // Check if max attempts (3) reached and cooldown is active
    if (totalAttempts >= 3) {
      // Get the most recent request (could be pending or cancelled)
      const mostRecentRequest = requests[0];
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const lastSubmissionDate = new Date(
        mostRecentRequest.submitted_at || Date.now(),
      );

      if (lastSubmissionDate > oneWeekAgo) {
        const daysRemaining = Math.ceil(
          7 -
            (Date.now() - lastSubmissionDate.getTime()) / (1000 * 60 * 60 * 24),
        );
        return {
          success: false,
          error: `You have reached the maximum number of verification attempts (3/3). Please wait ${daysRemaining} more day(s) before submitting another request.`,
        };
      }

      // Cooldown period has passed, delete all previous requests
      const allRequestIds = requests.map((r) => r.id);
      const allRequestPaths = requests.map((r) => r.document_path);

      // Delete documents from storage
      if (allRequestPaths.length > 0) {
        const { error: deleteStorageError } = await supabase.storage
          .from(VERIFICATION_BUCKET)
          .remove(allRequestPaths);

        if (deleteStorageError) {
          console.error("Failed to delete old documents:", deleteStorageError);
        }
      }

      // Delete database records
      const { error: deleteDbError } = await supabase
        .from("organization_verification_requests")
        .delete()
        .in("id", allRequestIds);

      if (deleteDbError) {
        console.error("Failed to delete old requests:", deleteDbError);
      }
    }

    // Cancel any existing pending requests before creating new one
    if (pendingRequests.length > 0) {
      const pendingIds = pendingRequests.map((r) => r.id);
      const { error: cancelError } = await supabase
        .from("organization_verification_requests")
        .update({ status: "cancelled" })
        .in("id", pendingIds);

      if (cancelError) {
        console.error("Failed to cancel previous requests:", cancelError);
        return {
          success: false,
          error: "Failed to cancel previous request. Please try again.",
        };
      }
    }

    // Upload document to Supabase Storage
    const base64Data = data.documentBase64.split(",")[1] || data.documentBase64;
    const documentBuffer = Buffer.from(base64Data, "base64");

    // Create unique file path: org-slug/timestamp-sanitized-filename
    const timestamp = Date.now();
    // Use slugify to safely sanitize the filename, preventing path traversal attacks
    const sanitizedFilename = slugify(data.documentName, {
      lower: true,
      strict: true, // Remove special characters
      replacement: "-",
    });
    const filePath = `${organization.slug}/${timestamp}-${sanitizedFilename}`;

    const { error: uploadError } = await supabase.storage
      .from(VERIFICATION_BUCKET)
      .upload(filePath, documentBuffer, {
        contentType: "application/pdf",
        upsert: false,
      });

    if (uploadError) {
      console.error("Failed to upload document:", uploadError);
      return {
        success: false,
        error: "Failed to upload document. Please try again.",
      };
    }

    // Create verification request record
    const { data: newRequest, error: insertError } = await supabase
      .from("organization_verification_requests")
      .insert({
        organization_id: organization.user_id,
        document_path: filePath,
        document_name: data.documentName,
        status: "pending",
      })
      .select("id")
      .single();

    if (insertError || !newRequest) {
      console.error("Failed to create verification request:", insertError);

      // Cleanup: Delete uploaded file if DB insert fails
      await supabase.storage.from(VERIFICATION_BUCKET).remove([filePath]);

      return {
        success: false,
        error: "Failed to create verification request. Please try again.",
      };
    }

    // Send email with Resend
    const resend = getResendClient();

    const fromEmail = process.env.RESEND_FROM_EMAIL!;
    const adminEmail = process.env.RESEND_PURE_HEARTS_EMAIL!;

    // Create review URL with verification request ID
    const baseUrl = process.env.NEXT_PUBLIC_DOMAIN || "http://localhost:3000";
    const reviewUrl = `${baseUrl}/admin/verify-organization/${newRequest.id}`;

    // Format the current date
    const submittedDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    // Render email template to HTML
    const emailHtml = await render(
      VerificationRequestEmail({
        organizationName: organization.organization_name,
        contactPersonName: contactInfo.contact_person_name,
        contactPersonEmail: contactInfo.contact_person_email,
        organizationPhone: organization.organization_phone,
        country: organization.country,
        state: organization.state,
        city: organization.city,
        address: organization.address,
        postalCode: organization.postal_code,
        missionStatement: organization.mission_statement,
        websiteUrl: organization.website_url || undefined,
        organizationId: organization.user_id,
        submittedDate: submittedDate,
        verificationRequestId: newRequest.id,
        reviewUrl: reviewUrl,
      }),
    );

    // Attach the document to the email
    const emailResult = await resend.emails.send({
      from: fromEmail,
      to: adminEmail,
      subject: `Verification Request: ${organization.organization_name}`,
      html: emailHtml,
      attachments: [
        {
          filename: data.documentName,
          content: documentBuffer,
        },
      ],
    });

    if (emailResult.error) {
      console.error("Failed to send verification email:", emailResult.error);
      return {
        success: false,
        error: "Failed to send verification request. Please try again.",
      };
    }

    // Revalidate the organization dashboard path to update UI
    revalidatePath(`/organizations/${organization.slug}`);

    return {
      success: true,
      message: "Verification request submitted successfully",
    };
  } catch (error) {
    console.error("Error submitting verification request:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}
