import { OrganizationSignupForm } from "@/components/page/signup/organization-signup-form";

export default function SignupPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <OrganizationSignupForm />
      </div>
    </div>
  );
}
