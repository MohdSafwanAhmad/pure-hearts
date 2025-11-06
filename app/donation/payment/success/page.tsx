import { Button } from "@/src/components/ui/button";
import { Check } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getStripe } from "@/src/lib/stripe";

export const metadata: Metadata = {
  title: "Donation Successful | Pure Hearts",
  description: "Thank you for your donation.",
};

export default async function DonationSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{
    sessionId?: string;
    organizationStripeAccountId?: string;
  }>;
}) {
  const { sessionId, organizationStripeAccountId } = await searchParams;

  if (!sessionId || !organizationStripeAccountId) {
    redirect("/");
  }

  const stripe = getStripe();
  const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);

  if (!checkoutSession || checkoutSession.payment_status !== "paid") {
    redirect("/");
  }

  const donationDetails = {
    projectName: checkoutSession.metadata?.projectName || "Unknown Project",
    organizationName:
      checkoutSession.metadata?.organizationName || "Unknown Organization",
    organizationSlug: checkoutSession.metadata?.organizationSlug || "",
    amount: checkoutSession.amount_subtotal
      ? checkoutSession.amount_subtotal / 100
      : 0,
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="flex flex-col items-center justify-center space-y-8 rounded-lg bg-white p-8 shadow-lg">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
          <Check className="h-12 w-12 text-green-600" />
        </div>

        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Thank You For Your Donation!</h1>
          <p className="text-xl text-muted-foreground">
            Your contribution makes a real difference.
          </p>
        </div>

        <div className="w-full max-w-md rounded-md bg-muted/50 p-6">
          <div className="space-y-4">
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium">Amount:</span>
              <span className="font-bold">
                ${donationDetails.amount.toFixed(2)} CAD
              </span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium">Project:</span>
              <span>{donationDetails.projectName}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Organization:</span>
              <span>{donationDetails.organizationName}</span>
            </div>
          </div>
        </div>

        <div className="space-y-2 pt-4 text-center">
          <p className="text-muted-foreground">
            A receipt has been emailed to you for your records.
          </p>
        </div>

        <div className="flex w-full flex-col space-y-4 pt-4 sm:flex-row sm:space-x-4 sm:space-y-0">
          <Button asChild variant="default" className="flex-1">
            <Link href="/">Return Home</Link>
          </Button>
          <Button asChild variant="outline" className="flex-1">
            <Link href="/campaigns">Explore More Campaigns</Link>
          </Button>
          <Button asChild variant="outline" className="flex-1">
            <Link href={`/organizations/${donationDetails.organizationSlug}`}>
              Visit {donationDetails.organizationName}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
