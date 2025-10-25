import { NextRequest, NextResponse } from "next/server";
import { headers as nextHeaders } from "next/headers";
import { getStripe } from "@/src/lib/stripe";
import { createServerSupabaseClient } from "@/src/lib/supabase/server";
import type Stripe from "stripe";

// Stripe requires the raw body for signature verification
export async function POST(req: NextRequest) {
  // 1) Verify if the webhook request is comming from Stripe
  const stripe = getStripe();
  const hdrs = await nextHeaders();
  const sig = hdrs.get("stripe-signature");
  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: `Webhook Error: ${errorMsg}` },
      { status: 400 }
    );
  }

  // 2) Handle the event
  const account = event.data.object as Stripe.Account;

  // 2.a) Handle account.updated event to update organization stripe connection status. This event is triggered when the organization completes the stripe onboarding process.
  if (event.type === "account.updated") {
    if (account.metadata?.organization_id) {
      const userId = account.metadata?.organization_id;

      const supabase = await createServerSupabaseClient();

      await supabase
        .from("organizations")
        .update({
          is_stripe_account_connected:
            account.capabilities?.transfers === "active" &&
            account.capabilities?.card_payments === "active",
        })
        .eq("user_id", userId);
    }
  }

  if (
    event.type === "checkout.session.completed" ||
    event.type === "checkout.session.async_payment_succeeded"
  ) {
    // 2.b) Handle successful checkout session, when the user/donor completes the payment
    const session = event.data.object as Stripe.Checkout.Session;
  }

  // Always return 200 to Stripe
  return NextResponse.json({ received: true });
}
