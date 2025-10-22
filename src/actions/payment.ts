"use server";

import { getStripe } from "@/src/lib/stripe";
import {
  createServerSupabaseClient,
  getOrganizationProfile,
} from "@/src/lib/supabase/server";
import { redirect } from "next/navigation";
import { ActionResponse } from "@/src/types/actions-types";

export async function createCheckoutSession() {
  // 1) get Logged in user
  // 2) if user logged in and has a stripe customer id, use that, else create one
  //// when creating strip customer, add metadata with user id and name, and make sure to save the stripe customer id to the user record
  // 3) create checkout session
  //   const session = await stripe.checkout.sessions.create({
  //     mode: "payment",
  //     customer: customerId,
  //     line_items: [
  //       {
  //         price_data: {
  //           currency: "usd",
  //           unit_amount: product.price * 100,
  //           product_data: {
  //             name: product.name,
  //             description: product.description,
  //           },
  //         },
  //         quantity: 1,
  //       },
  //     ],
  //     metadata: {
  //       productId: product.id,
  //       userId: user.id,
  //     },
  //     success_url:
  //       "http://localhost:3000/purchase/success?sessionId={CHECKOUT_SESSION_ID}",
  //     cancel_url: "http://localhost:5173/",
  //   });
  //   if (session.url == null) throw new Error("Session URL is null");
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
          payer: "application",
        },
        losses: {
          payments: "application",
        },
        stripe_dashboard: {
          type: "express",
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

export async function goToExpressDashboard() {
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
  const loginLink = await stripe.accounts.createLoginLink(
    organization.stripe_account_id
  );

  // 3) redirect to stripe dashboard
  return redirect(loginLink.url);
}

// so for regular user flow on signup we create a stripe customer account and store the id in supabase
// for orgs we create a stripe connected account and store that id in supabase
