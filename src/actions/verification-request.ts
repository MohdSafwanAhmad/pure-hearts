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

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB limit

interface VerificationRequestData {
  documentBase64: string;
  documentName: string;
  documentType: string;
}

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

    // Check for existing pending request
    const { data: existingRequest, error: existingError } = await supabase
      .from("organization_verification_requests")
      .select("id, document_path, status")
      .eq("organization_id", organization.user_id)
      .eq("status", "pending")
      .single();

    // If there's a pending request, delete it (document + record)
    if (existingRequest && !existingError) {
      // Delete the document from storage
      const { error: deleteStorageError } = await supabase.storage
        .from(VERIFICATION_BUCKET)
        .remove([existingRequest.document_path]);

      if (deleteStorageError) {
        console.error("Failed to delete old document:", deleteStorageError);
      }

      // Delete the database record
      const { error: deleteDbError } = await supabase
        .from("organization_verification_requests")
        .delete()
        .eq("id", existingRequest.id);

      if (deleteDbError) {
        console.error("Failed to delete old request:", deleteDbError);
      }
    }

    // Upload document to Supabase Storage
    const base64Data = data.documentBase64.split(",")[1] || data.documentBase64;
    const documentBuffer = Buffer.from(base64Data, "base64");

    // Create unique file path: org-id/timestamp-filename
    const timestamp = Date.now();
    const sanitizedFilename = data.documentName.replace(/[^a-zA-Z0-9.-]/g, "_");
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
    const { error: insertError } = await supabase
      .from("organization_verification_requests")
      .insert({
        organization_id: organization.user_id,
        document_path: filePath,
        document_name: data.documentName,
        status: "pending",
      });

    if (insertError) {
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
