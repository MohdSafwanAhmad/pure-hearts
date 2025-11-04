"use server";

import { createServerSupabaseClient } from "@/src/lib/supabase/server";
import { VERIFICATION_BUCKET } from "@/src/lib/constants";
import { ActionResponse } from "@/src/types/actions-types";
import {
  verifyOrganizationSchema,
  rejectOrganizationSchema,
} from "@/src/schemas/verify-organization";
import { getResendClient } from "@/src/lib/resend";
import { VerificationApprovedEmail } from "@/src/emails/verification-approved";
import { VerificationRejectedEmail } from "@/src/emails/verification-rejected";
import { render } from "@react-email/components";

interface ApproveOrganizationData {
  verificationRequestId: string;
  reviewerFirstName: string;
  reviewerLastName: string;
  reviewerPhone: string;
  adminNotes?: string;
}

interface RejectOrganizationData {
  verificationRequestId: string;
  reviewerFirstName: string;
  reviewerLastName: string;
  reviewerPhone: string;
  adminNotes: string;
}

/**
 * Approves an organization verification request.
 *
 * @param data The data needed to approve the request
 * @returns The result of the approval action
 */
export async function approveOrganization(
  data: ApproveOrganizationData,
): Promise<ActionResponse> {
  try {
    // Validate input
    const validationResult = verifyOrganizationSchema.safeParse({
      reviewerFirstName: data.reviewerFirstName,
      reviewerLastName: data.reviewerLastName,
      reviewerPhone: data.reviewerPhone,
    });

    if (!validationResult.success) {
      return {
        success: false,
        error: validationResult.error.issues[0]?.message || "Invalid input",
      };
    }

    const supabase = await createServerSupabaseClient();

    // Get the verification request
    const { data: request, error: requestError } = await supabase
      .from("organization_verification_requests")
      .select("organization_id, status")
      .eq("id", data.verificationRequestId)
      .single();

    if (requestError || !request) {
      return {
        success: false,
        error: "Verification request not found",
      };
    }

    // Check if request is still pending
    if (request.status !== "pending") {
      return {
        success: false,
        error: `This verification request has already been ${request.status}`,
      };
    }

    // Get organization and contact info in parallel
    const [
      { data: orgInfo, error: orgError },
      { data: contactInfo, error: contactError },
    ] = await Promise.all([
      supabase
        .from("organizations")
        .select("organization_name")
        .eq("user_id", request.organization_id)
        .single(),
      supabase
        .from("organization_contact_info")
        .select("contact_person_name, contact_person_email")
        .eq("organization_id", request.organization_id)
        .single(),
    ]);

    if (orgError || !orgInfo || contactError || !contactInfo) {
      return {
        success: false,
        error: "Organization or contact information not found",
      };
    }

    // Get all requests for this organization to delete cancelled/rejected ones
    const { data: allRequests, error: allRequestsError } = await supabase
      .from("organization_verification_requests")
      .select("id, document_path, status")
      .eq("organization_id", request.organization_id)
      .neq("id", data.verificationRequestId);

    if (allRequestsError) {
      console.error("Failed to fetch all requests:", allRequestsError);
    }

    // Delete all cancelled and rejected requests
    const requestsToDelete =
      allRequests?.filter(
        (r) => r.status === "cancelled" || r.status === "rejected",
      ) || [];

    if (requestsToDelete.length > 0) {
      const idsToDelete = requestsToDelete.map((r) => r.id);
      const pathsToDelete = requestsToDelete.map((r) => r.document_path);

      // Delete documents from storage
      if (pathsToDelete.length > 0) {
        const { error: deleteStorageError } = await supabase.storage
          .from(VERIFICATION_BUCKET)
          .remove(pathsToDelete);

        if (deleteStorageError) {
          console.error("Failed to delete old documents:", deleteStorageError);
        }
      }

      // Delete database records
      const { error: deleteDbError } = await supabase
        .from("organization_verification_requests")
        .delete()
        .in("id", idsToDelete);

      if (deleteDbError) {
        console.error("Failed to delete old requests:", deleteDbError);
      }
    }

    // Update verification request to approved
    const { error: updateRequestError } = await supabase
      .from("organization_verification_requests")
      .update({
        status: "approved",
        reviewed_at: new Date().toISOString(),
        reviewed_by_first_name: data.reviewerFirstName,
        reviewed_by_last_name: data.reviewerLastName,
        reviewed_by_phone: data.reviewerPhone,
        admin_notes: data.adminNotes || null,
      })
      .eq("id", data.verificationRequestId);

    if (updateRequestError) {
      console.error(
        "Failed to update verification request:",
        updateRequestError,
      );
      return {
        success: false,
        error: "Failed to approve verification request",
      };
    }

    // Update organization to verified
    const { error: updateOrgError } = await supabase
      .from("organizations")
      .update({ is_verified: true })
      .eq("user_id", request.organization_id);

    if (updateOrgError) {
      console.error("Failed to update organization:", updateOrgError);
      return {
        success: false,
        error: "Failed to mark organization as verified",
      };
    }

    // Send approval email to contact person
    try {
      const resend = getResendClient();

      const baseUrl = process.env.NEXT_PUBLIC_DOMAIN || "http://localhost:3000";
      const dashboardUrl = `${baseUrl}/dashboard`;
      const reviewerName = `${data.reviewerFirstName} ${data.reviewerLastName}`;

      // Render email template to HTML
      const emailHtml = await render(
        VerificationApprovedEmail({
          organizationName: orgInfo.organization_name,
          contactPersonName: contactInfo.contact_person_name,
          reviewerName,
          dashboardUrl,
          adminNotes: data.adminNotes,
        }),
      );

      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL!,
        to: process.env.RESEND_TESTING_TO_EMAIL
          ? process.env.RESEND_TESTING_TO_EMAIL
          : contactInfo.contact_person_email,
        subject: "🎉 Your Organization Has Been Verified!",
        html: emailHtml,
      });
    } catch (emailError) {
      console.error("Failed to send approval email:", emailError);
      // Don't fail the whole operation if email fails
    }

    return {
      success: true,
      message: "Organization verified successfully",
    };
  } catch (error) {
    console.error("Error approving organization:", error);
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}

/**
 * Rejects an organization verification request.
 *
 * @param data The data needed to reject the request
 * @returns The result of the rejection action
 */
export async function rejectOrganization(
  data: RejectOrganizationData,
): Promise<ActionResponse> {
  try {
    // Validate input
    const validationResult = rejectOrganizationSchema.safeParse({
      reviewerFirstName: data.reviewerFirstName,
      reviewerLastName: data.reviewerLastName,
      reviewerPhone: data.reviewerPhone,
      adminNotes: data.adminNotes,
    });

    if (!validationResult.success) {
      return {
        success: false,
        error: validationResult.error.issues[0]?.message || "Invalid input",
      };
    }

    const supabase = await createServerSupabaseClient();

    // Get the verification request
    const { data: request, error: requestError } = await supabase
      .from("organization_verification_requests")
      .select("organization_id, status")
      .eq("id", data.verificationRequestId)
      .single();

    if (requestError || !request) {
      return {
        success: false,
        error: "Verification request not found",
      };
    }

    // Check if request is still pending
    if (request.status !== "pending") {
      return {
        success: false,
        error: `This verification request has already been ${request.status}`,
      };
    }

    // Get organization and contact info in parallel
    const [
      { data: orgInfo, error: orgError },
      { data: contactInfo, error: contactError },
      { data: allRequests },
    ] = await Promise.all([
      supabase
        .from("organizations")
        .select("organization_name")
        .eq("user_id", request.organization_id)
        .single(),
      supabase
        .from("organization_contact_info")
        .select("contact_person_name, contact_person_email")
        .eq("organization_id", request.organization_id)
        .single(),
      supabase
        .from("organization_verification_requests")
        .select("status")
        .eq("organization_id", request.organization_id),
    ]);

    if (orgError || !orgInfo || contactError || !contactInfo) {
      return {
        success: false,
        error: "Organization or contact information not found",
      };
    }

    // Get all requests to count attempts

    const totalAttempts =
      allRequests?.filter(
        (r) => r.status === "pending" || r.status === "cancelled",
      ).length || 1;
    const attemptsRemaining = Math.max(0, 3 - totalAttempts);

    // Update verification request to rejected
    const { error: updateError } = await supabase
      .from("organization_verification_requests")
      .update({
        status: "rejected",
        reviewed_at: new Date().toISOString(),
        reviewed_by_first_name: data.reviewerFirstName,
        reviewed_by_last_name: data.reviewerLastName,
        reviewed_by_phone: data.reviewerPhone,
        admin_notes: data.adminNotes,
      })
      .eq("id", data.verificationRequestId);

    if (updateError) {
      console.error("Failed to update verification request:", updateError);
      return {
        success: false,
        error: "Failed to reject verification request",
      };
    }

    // Send rejection email to contact person
    try {
      const resend = getResendClient();

      const baseUrl = process.env.NEXT_PUBLIC_DOMAIN || "http://localhost:3000";
      const resubmitUrl =
        attemptsRemaining > 0 ? `${baseUrl}/dashboard` : undefined;
      const reviewerName = `${data.reviewerFirstName} ${data.reviewerLastName}`;

      // Render email template to HTML
      const emailHtml = await render(
        VerificationRejectedEmail({
          organizationName: orgInfo.organization_name,
          contactPersonName: contactInfo.contact_person_name,
          reviewerName,
          adminNotes: data.adminNotes,
          attemptsRemaining,
          resubmitUrl,
        }),
      );

      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL!,
        to: process.env.RESEND_TESTING_TO_EMAIL
          ? process.env.RESEND_TESTING_TO_EMAIL
          : contactInfo.contact_person_email,
        subject: "Update Needed: Your Verification Request",
        html: emailHtml,
      });
    } catch (emailError) {
      console.error("Failed to send rejection email:", emailError);
      // Don't fail the whole operation if email fails
    }

    return {
      success: true,
      message: "Organization verification rejected",
    };
  } catch (error) {
    console.error("Error rejecting organization:", error);
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}
