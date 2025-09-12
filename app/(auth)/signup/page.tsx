import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-md">
        <div className="space-y-6 text-center">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              Join Pure Hearts
            </h1>
            <p className="text-muted-foreground text-sm md:text-base">
              Choose how you&apos;d like to make a difference
            </p>
          </div>

          <div className="space-y-4">
            <Link
              href="/signup/donor"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-4 text-primary-foreground font-medium transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <span>Sign up as a Donor</span>
            </Link>

            <Link
              href="/signup/organization"
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-input bg-background px-6 py-4 font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <span>Sign up as an Organization</span>
            </Link>
          </div>

          <p className="text-muted-foreground text-xs md:text-sm">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-primary underline-offset-4 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
