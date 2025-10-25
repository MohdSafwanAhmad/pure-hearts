"use server";

import { getStripe } from "@/src/lib/stripe";
import {
  createServerSupabaseClient,
  getDonorProfile,
  getOrganizationProfile,
} from "@/src/lib/supabase/server";
import { donationSchema, type DonationSchema } from "@/src/schemas/donation";
import { ActionResponse } from "@/src/types/actions-types";
import { redirect } from "next/navigation";
import Stripe from "stripe";

// https://stripe.com/en-ca/pricing/local-payment-methods
// https://docs.stripe.com/connect/direct-charges?platform=web&ui=stripe-hosted#platform-visibility-limitations
// https://docs.stripe.com/connect/testing
// T!t!t1234!te

export async function createCheckoutSession(formData: DonationSchema) {
  // Validate the donation data
  const validationResult = donationSchema.safeParse(formData);

  if (!validationResult.success) {
    throw new Error(`Invalid donation data: ${validationResult.error.message}`);
  }

  const parameters = validationResult.data;

  // 1) get Logged in user
  const donor = await getDonorProfile();

  // 2) if user logged in and has a stripe customer id, use that, else create one
  const stripe = getStripe();
  let customer: Stripe.Response<Stripe.Customer> | null = null;

  if (donor) {
    let customerId = donor.stripe_account_id;
    if (!customerId) {
      customer = await stripe.customers.create({
        email: donor.email,
        name: `${donor.first_name} ${donor.last_name}`,
        metadata: {
          user_id: donor.user_id,
        },
      });
      customerId = customer.id;
      const supabase = await createServerSupabaseClient();
      await supabase
        .from("donors")
        .update({ stripe_account_id: customerId })
        .eq("user_id", donor.user_id);
    }
  }

  // 3) create checkout session
  const donationAmountInCents = Math.round(parameters.donationAmount * 100);

  const session = await stripe.checkout.sessions.create(
    {
      mode: "payment",
      customer: donor?.stripe_account_id ?? undefined, // undefined if guest checkout
      line_items: [
        {
          price_data: {
            currency: "cad",
            unit_amount: donationAmountInCents,
            product_data: {
              name: parameters.projectName,
              description: parameters.projectDescription,
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        projectId: parameters.projectId,
        projectName: parameters.projectName,
        organizationId: parameters.organizationId,
        organizationSlug: parameters.organizationSlug,
        organizationName: parameters.organizationName,
        userId: donor?.user_id ?? null,
      },
      success_url: `${process.env.NEXT_PUBLIC_DOMAIN}/donation/payment/success?sessionId={CHECKOUT_SESSION_ID}&organizationStripeAccountId=${parameters.organizationStripeAccountId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_DOMAIN}/donation/payment/cancel?projectId=${parameters.projectId}`,
    },
    {
      stripeAccount: parameters.organizationStripeAccountId,
    }
  );

  if (session.url == null) throw new Error("Session URL is invalid");

  // 4) redirect to checkout
  return redirect(session.url);
}

export async function linkStripeAccount(): Promise<ActionResponse> {
  // https://docs.stripe.com/connect/api-onboarding?accounts-namespace=v1
  // 1) get logged in user and org info
  const organization = await getOrganizationProfile();

  if (!organization) {
    return {
      error: "You must be logged in to set up organization payments",
      success: false,
    };
  }

  // 2) when the org signup i need to create a stripe customer for the org else i create one here if it does not exist
  const stripe = getStripe();
  let organizationStripeAccountId = organization.stripe_account_id;
  if (!organizationStripeAccountId) {
    const account = await stripe.accounts.create({
      email: organization.email,
      metadata: {
        organization_name: organization.organization_name,
        organization_id: organization.user_id,
      },
      controller: {
        fees: {
          payer: "account",
        },
        losses: {
          payments: "stripe",
        },
        stripe_dashboard: {
          type: "full",
        },
      },
      country: "CA",
    });

    organizationStripeAccountId = account.id;

    // save the stripe account id to the org profile in supabase
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase
      .from("organizations")
      .update({ stripe_account_id: organizationStripeAccountId })
      .eq("user_id", organization.user_id);

    if (error) {
      console.error("Error saving Stripe account ID:", error);
      return {
        error: "Failed to save Stripe account ID to organization profile",
        success: false,
      };
    }
  }

  // 2) build the url for the org to create set its payment method and billing info
  const accountLink = await stripe.accountLinks.create({
    account: organizationStripeAccountId,
    refresh_url: `${process.env.NEXT_PUBLIC_DOMAIN}/organizations/${organization.slug}`,
    return_url: `${process.env.NEXT_PUBLIC_DOMAIN}/organizations/${organization.slug}`,
    type: "account_onboarding",
    collection_options: {
      fields: "eventually_due",
    },
  });

  // 3) redirect to stripe onboarding url
  return redirect(accountLink.url!);
}

export async function goToStripeDashboard() {
  // 1) get logged in user and org info
  const organization = await getOrganizationProfile();
  if (!organization) {
    return {
      error: "You must be logged in to access the dashboard",
      success: false,
    };
  }

  const stripe = getStripe();

  if (!organization.stripe_account_id) {
    return {
      error: "Organization does not have a Stripe account connected",
      success: false,
    };
  }

  // 2) create the login link
  const accountLink = await stripe.accountLinks.create({
    account: organization.stripe_account_id,
    refresh_url: `${process.env.NEXT_PUBLIC_DOMAIN}/organizations/${organization.slug}`,
    return_url: `${process.env.NEXT_PUBLIC_DOMAIN}/organizations/${organization.slug}`,
    type: "account_onboarding",
  });

  // 3) redirect to stripe dashboard
  return redirect(accountLink.url);
}
