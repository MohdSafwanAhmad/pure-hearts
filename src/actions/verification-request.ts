"use server";

import { VerificationRequestEmail } from "@/src/emails/verification-request";
import { getResendClient } from "@/src/lib/resend";
import {
  createServerSupabaseClient,
  getOrganizationProfile,
} from "@/src/lib/supabase/server";
import { render } from "@react-email/components";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB limit

interface VerificationRequestData {
  documentBase64: string;
  documentName: string;
  documentType: string;
}

export async function submitVerificationRequest(data: VerificationRequestData) {
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
        error: "Document size exceeds 5MB limit. Please upload a smaller file.",
      };
    }

    // Validate file type
    if (data.documentType !== "application/pdf") {
      return {
        success: false,
        error: "Only PDF documents are allowed",
      };
    }

    // Send email with Resend
    const resend = getResendClient();

    // Convert base64 to buffer for attachment
    const base64Data = data.documentBase64.split(",")[1] || data.documentBase64;
    const documentBuffer = Buffer.from(base64Data, "base64");

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
        missionStatement: organization.mission_statement,
        websiteUrl: organization.website_url || undefined,
        organizationId: organization.user_id,
      }),
    );

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
