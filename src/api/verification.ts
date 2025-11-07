import {
  createServerSupabaseClient,
  getOrganizationProfile,
} from "@/src/lib/supabase/server";
import {
  VERIFICATION_BUCKET,
  PUBLIC_IMAGE_BUCKET_NAME,
} from "@/src/lib/constants";

export interface VerificationStatus {
  hasRequest: boolean;
  status: "pending" | "approved" | "rejected" | "cancelled" | "cooldown" | null;
  attemptsUsed: number;
  maxAttempts: number;
  daysUntilNextAttempt: number | null;
  canSubmit: boolean;
  message: string;
  adminNotes?: string | null;
  reviewedBy?: string | null;
}

export async function getVerificationStatus(): Promise<VerificationStatus> {
  try {
    const supabase = await createServerSupabaseClient();
    const organization = await getOrganizationProfile();

    if (!organization) {
      return {
        hasRequest: false,
        status: null,
        attemptsUsed: 0,
        maxAttempts: 3,
        daysUntilNextAttempt: null,
        canSubmit: false,
        message: "Organization not found",
      };
    }

    // If already verified, no need to check requests
    if (organization.is_verified) {
      return {
        hasRequest: false,
        status: "approved",
        attemptsUsed: 0,
        maxAttempts: 3,
        daysUntilNextAttempt: null,
        canSubmit: false,
        message: "Your organization is already verified",
      };
    }

    // Get all requests for this organization
    const { data: allRequests, error: requestsError } = await supabase
      .from("organization_verification_requests")
      .select(
        "id, status, submitted_at, admin_notes, reviewed_by_first_name, reviewed_by_last_name",
      )
      .eq("organization_id", organization.user_id)
      .order("submitted_at", { ascending: false });

    if (requestsError) {
      console.error("Failed to fetch verification requests:", requestsError);
      return {
        hasRequest: false,
        status: null,
        attemptsUsed: 0,
        maxAttempts: 3,
        daysUntilNextAttempt: null,
        canSubmit: true,
        message: "",
      };
    }

    const requests = allRequests || [];
    const pendingRequests = requests.filter((r) => r.status === "pending");
    const cancelledRequests = requests.filter((r) => r.status === "cancelled");
    const rejectedRequests = requests.filter((r) => r.status === "rejected");

    // Calculate total attempts (pending + cancelled, excluding rejected)
    const totalAttempts = pendingRequests.length + cancelledRequests.length;

    // Check if there's a pending request
    if (pendingRequests.length > 0) {
      return {
        hasRequest: true,
        status: "pending",
        attemptsUsed: totalAttempts,
        maxAttempts: 3,
        daysUntilNextAttempt: null,
        canSubmit: totalAttempts < 3, // Can resubmit if under 3 attempts
        message:
          totalAttempts < 3
            ? `Your verification request is currently being reviewed. You can resubmit with updated documents if needed (${totalAttempts}/3 attempts used).`
            : "Your verification request is currently being reviewed by our team. We'll notify you once it's processed.",
      };
    }

    // Check if there's a rejected request
    if (rejectedRequests.length > 0) {
      const latestRejected = rejectedRequests[0];
      const reviewerName =
        latestRejected.reviewed_by_first_name &&
        latestRejected.reviewed_by_last_name
          ? `${latestRejected.reviewed_by_first_name} ${latestRejected.reviewed_by_last_name}`
          : null;

      return {
        hasRequest: true,
        status: "rejected",
        attemptsUsed: totalAttempts,
        maxAttempts: 3,
        daysUntilNextAttempt: null,
        canSubmit: totalAttempts < 3,
        message:
          totalAttempts < 3
            ? `Your previous verification request was rejected. You have ${3 - totalAttempts} attempt(s) remaining.`
            : "Your previous verification request was rejected. Please review the feedback.",
        adminNotes: latestRejected.admin_notes,
        reviewedBy: reviewerName,
      };
    }

    // Check if max attempts reached and cooldown is active
    if (totalAttempts >= 3) {
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
          hasRequest: true,
          status: "cooldown",
          attemptsUsed: 3,
          maxAttempts: 3,
          daysUntilNextAttempt: daysRemaining,
          canSubmit: false,
          message: `You have reached the maximum number of verification attempts (3/3). Please wait ${daysRemaining} more day(s) before submitting another request.`,
        };
      }
    }

    // Can submit new request
    return {
      hasRequest: totalAttempts > 0,
      status: totalAttempts > 0 ? "cancelled" : null,
      attemptsUsed: totalAttempts,
      maxAttempts: 3,
      daysUntilNextAttempt: null,
      canSubmit: true,
      message:
        totalAttempts > 0
          ? `You have ${3 - totalAttempts} verification attempt(s) remaining.`
          : "Submit your verification request to get your organization verified.",
    };
  } catch (error) {
    console.error("Error getting verification status:", error);
    return {
      hasRequest: false,
      status: null,
      attemptsUsed: 0,
      maxAttempts: 3,
      daysUntilNextAttempt: null,
      canSubmit: true,
      message: "",
    };
  }
}

export interface VerificationRequestDetails {
  id: string;
  status: "pending" | "approved" | "rejected" | "cancelled";
  submittedAt: string;
  documentName: string;
  documentPath: string;
  adminNotes: string | null;
  reviewedAt: string | null;
  reviewedByFirstName: string | null;
  reviewedByLastName: string | null;
  reviewedByPhone: string | null;
  organization: {
    userId: string;
    organizationName: string;
    organizationPhone: string;
    country: string;
    state: string;
    city: string;
    address: string;
    postalCode: string;
    missionStatement: string;
    websiteUrl: string | null;
    logo: string | null;
    slug: string;
    isVerified: boolean;
    contactPersonName: string | null;
    contactPersonEmail: string | null;
    contactPersonPhone: string | null;
    projectAreas: {
      id: number;
      label: string;
    }[];
  };
  documentUrl: string | null;
  latestPendingRequestId: string | null;
}

export async function getVerificationRequestDetails(
  requestId: string,
): Promise<VerificationRequestDetails | null> {
  try {
    const supabase = await createServerSupabaseClient();

    // Get verification request
    const { data: request, error: requestError } = await supabase
      .from("organization_verification_requests")
      .select("*")
      .eq("id", requestId)
      .single();

    if (requestError || !request) {
      return null;
    }

    // Get organization details
    const { data: organization, error: orgError } = await supabase
      .from("organizations")
      .select("*")
      .eq("user_id", request.organization_id)
      .single();

    if (orgError || !organization) {
      return null;
    }

    // Get organization contact info
    const { data: contactInfo } = await supabase
      .from("organization_contact_info")
      .select("*")
      .eq("organization_id", request.organization_id)
      .single();

    // Get project areas
    const { data: projectAreas } = await supabase
      .from("organization_project_areas")
      .select("project_areas(id, label)")
      .eq("organization_id", request.organization_id);

    const areas =
      projectAreas?.map(
        (row: { project_areas: { id: number; label: string } }) =>
          row.project_areas,
      ) ?? [];

    // Get document URL from storage
    let documentUrl: string | null = null;
    if (request.document_path) {
      const { data: urlData } = await supabase.storage
        .from(VERIFICATION_BUCKET)
        .createSignedUrl(request.document_path, 3600); // 1 hour expiry

      documentUrl = urlData?.signedUrl || null;
    }

    // Get logo URL if exists
    let logoUrl: string | null = organization.logo;
    if (organization.logo) {
      const { data: logoData } = supabase.storage
        .from(PUBLIC_IMAGE_BUCKET_NAME)
        .getPublicUrl(organization.logo);
      logoUrl = logoData.publicUrl;
    }

    // If cancelled or rejected, get the latest pending request ID
    let latestPendingRequestId: string | null = null;
    if (request.status === "cancelled" || request.status === "rejected") {
      const { data: latestPending } = await supabase
        .from("organization_verification_requests")
        .select("id")
        .eq("organization_id", request.organization_id)
        .eq("status", "pending")
        .order("submitted_at", { ascending: false })
        .limit(1)
        .single();

      latestPendingRequestId = latestPending?.id || null;
    }

    return {
      id: request.id,
      status: request.status as
        | "pending"
        | "approved"
        | "rejected"
        | "cancelled",
      submittedAt: request.submitted_at || new Date().toISOString(),
      documentName: request.document_name,
      documentPath: request.document_path,
      adminNotes: request.admin_notes,
      reviewedAt: request.reviewed_at,
      reviewedByFirstName: request.reviewed_by_first_name,
      reviewedByLastName: request.reviewed_by_last_name,
      reviewedByPhone: request.reviewed_by_phone,
      organization: {
        userId: organization.user_id,
        organizationName: organization.organization_name,
        organizationPhone: organization.organization_phone,
        country: organization.country,
        state: organization.state,
        city: organization.city,
        address: organization.address,
        postalCode: organization.postal_code,
        missionStatement: organization.mission_statement,
        websiteUrl: organization.website_url,
        logo: logoUrl,
        slug: organization.slug,
        isVerified: organization.is_verified || false,
        contactPersonName: contactInfo?.contact_person_name || null,
        contactPersonEmail: contactInfo?.contact_person_email || null,
        contactPersonPhone: contactInfo?.contact_person_phone || null,
        projectAreas: areas,
      },
      documentUrl,
      latestPendingRequestId,
    };
  } catch (error) {
    console.error("Error getting verification request details:", error);
    return null;
  }
}
