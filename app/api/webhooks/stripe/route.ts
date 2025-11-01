import { NextRequest, NextResponse } from "next/server";
import { headers as nextHeaders } from "next/headers";
import { getStripe } from "@/src/lib/stripe";
import { createServerSupabaseClient } from "@/src/lib/supabase/server";
import type Stripe from "stripe";
import { getResendClient } from "@/src/lib/resend";
import { render } from "@react-email/components";
import DonationReceiptEmail from "@/src/emails/donation-receipt";
import { generateReceiptPdf } from "@/src/api/donations";

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
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: `Webhook Error: ${errorMsg}` },
      { status: 400 },
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
            account.capabilities?.transfers === "active",
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
      );
      const paymentIntentId = charge.payment_intent as string;

      // in cents
      const { fee, amount, currency } = balanceTransaction;

      // update the donation record with fee and net amount
      const supabase = await createServerSupabaseClient();
      await supabase
        .from("donations")
        .update({
          stripe_fee: fee / 100,
          amount: amount / 100,
          currency: currency,
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
  );

  // 1.1) Get balance transaction details for fee and net amount

  let stripeFee = 0;
  const amountDonation = session.amount_total! / 100;

  const chargeId = paymentIntent.latest_charge;

  if (chargeId && typeof chargeId === "string") {
    const charge = await stripe.charges.retrieve(chargeId);
    const balanceTransaction = charge.balance_transaction;
    if (balanceTransaction && typeof balanceTransaction === "string") {
      const balanceDetails =
        await stripe.balanceTransactions.retrieve(balanceTransaction);
      stripeFee = balanceDetails.fee / 100;
    }
  }

  // 1.2) Insert donation record
  const { data: insertedDonation, error } = await supabase
    .from("donations")
    .insert({
      // Identifiers
      stripe_payment_id: stripe_payment_intent_id,
      donor_id: metadata.userId || null, // User ID from logged-in user account (if any)
      project_id: metadata.projectId,
      is_anonymous: !metadata.userId,

      // Donation details
      amount: amountDonation,
      stripe_fee: stripeFee,
      currency: session.currency ?? undefined,
      payment_method: session.payment_method_types?.[0],

      // Donor in-app information
      donor_in_app_email: metadata.userEmail,
      donor_in_app_first_name: metadata.donorInAppFirstName,
      donor_in_app_last_name: metadata.donorInAppLastName,
      donor_in_app_country: metadata.donorInAppCountry,
      donor_in_app_state: metadata.donorInAppState,
      donor_in_app_city: metadata.donorInAppCity,
      donor_in_app_address: metadata.donorInAppAddress,
      donor_in_app_postal_code: metadata.donorInAppPostalCode,
      donor_in_app_phone: metadata.donorInAppPhone,

      // Donor Stripe information
      donor_stripe_email: session.customer_details?.email || "", // Email used in checkout/transaction
      donor_stripe_name: session.customer_details?.name,
      donor_stripe_phone: session.customer_details?.phone,
      donor_stripe_billing_address: fullAddress,
      donor_stripe_billing_city: billingAddress?.city,
      donor_stripe_billing_state: billingAddress?.state,
      donor_stripe_billing_postal_code: billingAddress?.postal_code,
      donor_stripe_billing_country: billingAddress?.country,

      // Organization snapshot information
      organization_name: metadata.organizationName,
      organization_phone: metadata.organizationPhone,
      organization_stripe_account_id: metadata.organizationStripeAccountId,
      organization_country: metadata.organizationCountry,
      organization_state: metadata.organizationState,
      organization_city: metadata.organizationCity,
      organization_address: metadata.organizationAddress,
      organization_postal_code: metadata.organizationPostalCode,

      // Project snapshot information
      project_title: metadata.projectTitle,
      project_description: metadata.projectDescription,
      project_goal_amount: parseFloat(metadata.projectGoalAmount || "0"),
    })
    .select()
    .single();

  if (error) {
    console.error("Error inserting donation record:", error);
    return;
  }

  // 2) Fill donor details if not present
  if (metadata.userId) {
    const { data: donor } = await supabase
      .from("donors")
      .select("address, city, state, country, phone, postal_code")
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
          postal_code:
            donor.postal_code ?? billingAddress?.postal_code ?? undefined,
        })
        .eq("user_id", metadata.userId);
    }
  }

  // 3) Send receipt email
  try {
    const donorEmail =
      metadata.userEmail || session.customer_details?.email || "";

    if (!donorEmail || !insertedDonation) {
      console.error("Missing email or donation data for receipt");
      return;
    }

    // Prepare receipt data
    const donorName =
      [metadata.donorInAppFirstName, metadata.donorInAppLastName]
        .filter(Boolean)
        .join(" ") ||
      session.customer_details?.name ||
      donorEmail;

    const receiptData = {
      id: insertedDonation.id,
      amount: amountDonation,
      created_at: insertedDonation.created_at || new Date().toISOString(),
      donorName,
      donorEmail,
      organizationName: metadata.organizationName || "—",
      projectTitle: metadata.projectTitle || "—",
    };

    // Generate PDF receipt
    const pdfBuffer = await generateReceiptPdf(receiptData);

    // Render email template
    const emailHtml = await render(
      DonationReceiptEmail({
        donorName,
        organizationName: metadata.organizationName || "—",
        projectTitle: metadata.projectTitle || "—",
        amount: amountDonation,
        date: new Date(receiptData.created_at).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        receiptId: insertedDonation.id,
      }),
    );

    // Send email with Resend
    const resend = getResendClient();
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!, // Use this for testing without domain
      to: process.env.RESEND_TESTING_TO_EMAIL
        ? process.env.RESEND_TESTING_TO_EMAIL
        : donorEmail, // in test mode only verified emails can be used, so use the pure heart gmail address
      subject: "Thank You for Your Donation - Receipt Attached",
      html: emailHtml,
      attachments: [
        {
          filename: `receipt-${insertedDonation.id}.pdf`,
          content: pdfBuffer,
        },
      ],
    });
  } catch (emailError) {
    console.error("Error sending receipt email:", emailError);
    // Don't throw - we don't want to fail the webhook if email fails
  }
};
