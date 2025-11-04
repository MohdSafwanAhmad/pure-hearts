import { getVerificationRequestDetails } from "@/src/api/verification";
import { notFound } from "next/navigation";
import { VerifyOrganizationClient } from "@/src/components/page/admin/verify-organization-client";

interface VerifyOrganizationPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function VerifyOrganizationPage({
  params,
}: VerifyOrganizationPageProps) {
  const { id } = await params;
  
  const requestDetails = await getVerificationRequestDetails(id);

  if (!requestDetails) {
    notFound();
  }

  return <VerifyOrganizationClient requestDetails={requestDetails} />;
}
