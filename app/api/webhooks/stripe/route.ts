import { NextRequest, NextResponse } from "next/server";
import { headers as nextHeaders } from "next/headers";
import { getStripe } from "@/src/lib/stripe";
import { createServerSupabaseClient } from "@/src/lib/supabase/server";
import type Stripe from "stripe";

// Stripe requires the raw body for signature verification
export async function POST(req: NextRequest) {
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

  const account = event.data.object as Stripe.Account;
  if (event.type === "account.updated") {
    if (account.metadata?.organization_id) {
      const userId = account.metadata?.organization_id;

      const supabase = await createServerSupabaseClient();
      await supabase
        .from("organizations")
        .update({
          is_stripe_account_connected:
            account.capabilities?.transfers === "active",
        })
        .eq("user_id", userId);
    }
  }

  // Always return 200 to Stripe
  return NextResponse.json({ received: true });
}
