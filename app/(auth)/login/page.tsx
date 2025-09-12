import Link from "next/link";
import { Button } from "@/src/components/ui/button";

export default function LoginPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-md">
        <div className="space-y-6 text-center">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              Welcome back to Pure Hearts
            </h1>
            <p className="text-muted-foreground text-sm md:text-base">
              Choose how you&apos;d like to sign in
            </p>
          </div>

          <div className="space-y-4">
            <Button asChild size="lg" className="w-full">
              <Link href="/login/donor">
                Login as a Donor
              </Link>
            </Button>

            <Button asChild variant="outline" size="lg" className="w-full">
              <Link href="/login/organization">
                Login as an Organization
              </Link>
            </Button>
          </div>

          <p className="text-muted-foreground text-xs md:text-sm">
            Don&apos;t have an account?{" "}
            <Button asChild variant="link" className="h-auto p-0 text-xs md:text-sm">
              <Link href="/signup">
                Sign up
              </Link>
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
}
