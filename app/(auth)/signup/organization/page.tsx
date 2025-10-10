import { getProjectAreas } from "@/src/api/organization";
import { OrganizationSignupForm } from "@/src/components/page/signup/organization-signup-form";

export default async function SignupPage() {
  const projectAreas = await getProjectAreas();
  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <OrganizationSignupForm projectAreas={projectAreas} />
      </div>
    </div>
  );
}
