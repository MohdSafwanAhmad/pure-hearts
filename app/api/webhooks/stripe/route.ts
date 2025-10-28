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
        .from("organization_payment_info")
        .update({
          is_stripe_account_connected:
            account.capabilities?.transfers === "active" &&
            account.capabilities?.card_payments === "active",
        })
        .eq("organization_id", userId);
    }
  }

  // 2.b) Handle successful checkout session, when the user/donor completes the payment
  if (
    event.type === "checkout.session.completed" ||
    event.type === "checkout.session.async_payment_succeeded"
  ) {
    const session = event.data.object as Stripe.Checkout.Session;

    await fulfillDonation(session);
  }

  // 2.c) Handle charge.updated to get the balance transaction details for fees and net amount of the donation. if it was not available during checkout.session.completed event.
  if (event.type === "charge.updated") {
    const charge = event.data.object as Stripe.Charge;

    if (charge.balance_transaction) {
      const balanceTransaction = await stripe.balanceTransactions.retrieve(
        charge.balance_transaction as string,
        {},
        {
          stripeAccount: event.account,
        }
      );
      const paymentIntentId = charge.payment_intent as string;

      // in cents
      const { net, fee } = balanceTransaction;

      // update the donation record with fee and net amount
      const supabase = await createServerSupabaseClient();
      await supabase
        .from("donations")
        .update({
          stripe_fee: fee / 100,
          amount: net / 100,
        })
        .eq("stripe_payment_id", paymentIntentId);
    }
  }

  // Always return 200 to Stripe
  return NextResponse.json({ received: true });
}

const fulfillDonation = async (session: Stripe.Checkout.Session) => {
  const supabase = await createServerSupabaseClient();
  const stripe = getStripe();

  // 1) Store donation details in the database

  const billingAddress = session.customer_details?.address;
  const fullAddress = [billingAddress?.line1, billingAddress?.line2]
    .filter(Boolean)
    .join(", ");

  const metadata = session.metadata || {};
  const stripe_payment_intent_id = session.payment_intent as string;

  const paymentIntent = await stripe.paymentIntents.retrieve(
    stripe_payment_intent_id,
    {},
    {
      stripeAccount: metadata.organizationStripeAccountId,
    }
  );

  // 1.1) Get balance transaction details for fee and net amount

  let stripeFee = 0;
  let amountDonation = session.amount_total! / 100;

  const chargeId = paymentIntent.latest_charge;

  if (chargeId && typeof chargeId === "string") {
    const charge = await stripe.charges.retrieve(
      chargeId,
      {},
      {
        stripeAccount: metadata.organizationStripeAccountId,
      }
    );
    const balanceTransaction = charge.balance_transaction;
    if (balanceTransaction && typeof balanceTransaction === "string") {
      const balanceDetails = await stripe.balanceTransactions.retrieve(
        balanceTransaction,
        {},
        {
          stripeAccount: metadata.organizationStripeAccountId,
        }
      );
      stripeFee = balanceDetails.fee / 100;
      amountDonation = (balanceDetails.amount - balanceDetails.fee) / 100;
    }
  }

  // 1.2) Insert donation record
  await supabase.from("donations").insert({
    stripe_payment_id: stripe_payment_intent_id,

    amount: amountDonation,
    stripe_fee: stripeFee,
    currency: session.currency ?? undefined,
    payment_method: session.payment_method_types?.[0],
    is_anonymous: !metadata.userId,

    donor_stripe_email: session.customer_details?.email || "", // Email used in checkout/transaction
    donor_name: session.customer_details?.name,
    donor_phone: session.customer_details?.phone,

    billing_address: fullAddress,
    billing_city: billingAddress?.city,
    billing_state: billingAddress?.state,
    billing_postal_code: billingAddress?.postal_code,
    billing_country: billingAddress?.country,

    donor_id: metadata.userId || null, // User ID from logged-in user account (if any)
    donor_app_email: metadata.userEmail || null, // Email from logged-in user account (if any)
    project_id: metadata.projectId,
  });

  // 2) Fill donor details if not present
  if (metadata.userId) {
    const { data: donor } = await supabase
      .from("donors")
      .select("address, city, state, country, phone")
      .eq("user_id", metadata.userId)
      .single();

    if (donor) {
      await supabase
        .from("donors")
        .update({
          address: donor.address ?? fullAddress ?? undefined,
          city: donor.city ?? billingAddress?.city ?? undefined,
          state: donor.state ?? billingAddress?.state ?? undefined,
          country: donor.country ?? billingAddress?.country ?? undefined,
          phone: donor.phone ?? session.customer_details?.phone ?? undefined,
        })
        .eq("user_id", metadata.userId);
    }
  }
};
