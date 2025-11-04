"use client";

import { useRouter } from "next/navigation";
import { VerificationRequestDetails } from "@/src/api/verification";
import {
  approveOrganization,
  rejectOrganization,
} from "@/src/actions/verify-organization";
import { toast } from "sonner";
import { TVerifyOrganizationSchema } from "@/src/schemas/verify-organization";
import { CancelledRequestAlert } from "@/src/components/page/admin/cancelled-request-alert";
import { RejectedRequestAlert } from "@/src/components/page/admin/rejected-request-alert";
import { ApprovedRequestAlert } from "@/src/components/page/admin/approved-request-alert";
import { OrganizationDetails } from "@/src/components/page/admin/organization-details";
import { ReviewForm } from "@/src/components/page/admin/review-form";

interface VerifyOrganizationClientProps {
  requestDetails: VerificationRequestDetails;
}

export function VerifyOrganizationClient({
  requestDetails,
}: VerifyOrganizationClientProps) {
  const router = useRouter();
  const { status, organization, documentUrl, latestPendingRequestId } =
    requestDetails;

  // Show cancelled message
  if (status === "cancelled") {
    return (
      <CancelledRequestAlert latestPendingRequestId={latestPendingRequestId} />
    );
  }

  // Show rejected message
  if (status === "rejected") {
    return (
      <RejectedRequestAlert
        adminNotes={requestDetails.adminNotes}
        reviewedByFirstName={requestDetails.reviewedByFirstName}
        reviewedByLastName={requestDetails.reviewedByLastName}
      />
    );
  }

  // Show approved message
  if (status === "approved") {
    return (
      <ApprovedRequestAlert
        organizationName={organization.organizationName}
        reviewedByFirstName={requestDetails.reviewedByFirstName}
        reviewedByLastName={requestDetails.reviewedByLastName}
        reviewedAt={requestDetails.reviewedAt}
        adminNotes={requestDetails.adminNotes}
      />
    );
  }

  // Pending - show review form
  const handleApprove = async (data: TVerifyOrganizationSchema) => {
    const result = await approveOrganization({
      verificationRequestId: requestDetails.id,
      reviewerFirstName: data.reviewerFirstName,
      reviewerLastName: data.reviewerLastName,
      reviewerPhone: data.reviewerPhone,
      adminNotes: data.adminNotes,
    });

    if (result.success) {
      toast.success("Organization verified successfully!");
      router.refresh();
    } else {
      toast.error(result.error || "Failed to approve organization");
    }
  };

  const handleReject = async (
    data: TVerifyOrganizationSchema & { adminNotes: string },
  ) => {
    const result = await rejectOrganization({
      verificationRequestId: requestDetails.id,
      reviewerFirstName: data.reviewerFirstName,
      reviewerLastName: data.reviewerLastName,
      reviewerPhone: data.reviewerPhone,
      adminNotes: data.adminNotes,
    });

    if (result.success) {
      toast.success("Organization verification rejected");
      router.refresh();
    } else {
      toast.error(result.error || "Failed to reject organization");
    }
  };

  const submittedDate = new Date(requestDetails.submittedAt).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    },
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-primary">
          Organization Verification Review
        </h1>
        <p className="text-muted-foreground mt-2">
          Review the organization details and uploaded documents
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <OrganizationDetails
            organization={organization}
            documentName={requestDetails.documentName}
            documentUrl={documentUrl}
            submittedDate={submittedDate}
          />
        </div>

        {/* Review Form - Not sticky, just regular positioning */}
        <div className="lg:col-span-1">
          <ReviewForm
            organizationName={organization.organizationName}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        </div>
      </div>
    </div>
  );
}
