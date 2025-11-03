import { createServerSupabaseClient, getOrganizationProfile } from "@/src/lib/supabase/server";

export interface VerificationStatus {
  hasRequest: boolean;
  status: "pending" | "approved" | "rejected" | "cancelled" | "cooldown" | null;
  attemptsUsed: number;
  maxAttempts: number;
  daysUntilNextAttempt: number | null;
  canSubmit: boolean;
  message: string;
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
      .select("id, status, submitted_at")
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
        message: totalAttempts < 3
          ? `Your verification request is currently being reviewed. You can resubmit with updated documents if needed (${totalAttempts}/3 attempts used).`
          : "Your verification request is currently being reviewed by our team. We'll notify you once it's processed.",
      };
    }

    // Check if there's a rejected request
    if (rejectedRequests.length > 0) {
      return {
        hasRequest: true,
        status: "rejected",
        attemptsUsed: totalAttempts,
        maxAttempts: 3,
        daysUntilNextAttempt: null,
        canSubmit: totalAttempts < 3,
        message: totalAttempts < 3
          ? `Your previous verification request was rejected. You have ${3 - totalAttempts} attempt(s) remaining.`
          : "Your previous verification request was rejected. Please review the feedback.",
      };
    }

    // Check if max attempts reached and cooldown is active
    if (totalAttempts >= 3) {
      const mostRecentRequest = requests[0];
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      
      const lastSubmissionDate = new Date(mostRecentRequest.submitted_at || Date.now());
      
      if (lastSubmissionDate > oneWeekAgo) {
        const daysRemaining = Math.ceil((7 - (Date.now() - lastSubmissionDate.getTime()) / (1000 * 60 * 60 * 24)));
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
      message: totalAttempts > 0 
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
