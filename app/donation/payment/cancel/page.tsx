import { Button } from "@/src/components/ui/button";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Donation Cancelled | Pure Hearts",
  description: "Your donation process has been cancelled.",
};

export default function DonationCancelPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="flex flex-col items-center justify-center space-y-8 rounded-lg bg-white p-8 shadow-lg">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-amber-100">
          <AlertCircle className="h-12 w-12 text-amber-600" />
        </div>

        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Donation Cancelled</h1>
          <p className="text-xl text-muted-foreground">
            Your payment process was cancelled.
          </p>
        </div>

        <div className="max-w-lg text-center text-muted-foreground">
          <p>
            We understand you might have questions or concerns about donating.
            If you need any assistance or have questions, please don&apos;t
            hesitate to contact us.
          </p>
        </div>

        <div className="flex w-full flex-col space-y-4 pt-4 sm:flex-row sm:space-x-4 sm:space-y-0">
          <Button asChild variant="default" className="w-full">
            <Link href="/">Return Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
