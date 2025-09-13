import { OTPForm } from "@/src/components/page/otp/otp-form";
import { Card, CardContent } from "@/src/components/ui/card";
import { redirect } from "next/navigation";

export default async function OTPPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const email = (await searchParams).email;

  // Redirect if no email is provided
  if (!email) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10 ">
      <div className="flex flex-col gap-6 w-full max-w-sm md:max-w-3xl">
        <Card className="overflow-hidden p-0">
          <CardContent className="p-6 md:p-8">
            <OTPForm email={email} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
