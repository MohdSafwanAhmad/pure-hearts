"use server";

import { redirect } from "next/navigation";

import { createAnonymousServerSupabaseClient } from "@/src/lib/supabase/server";
import { ActionResponse } from "@/src/types/actions-types";
import { createDonorSchema, loginDonorSchema } from "@/src/schemas/donor";

export async function signupAsDonor(
  formData: FormData
): Promise<ActionResponse> {
  const supabase = await createAnonymousServerSupabaseClient();

  // Parse donation preferences from form data
  const donationPreferences = formData
    .getAll("donation_preferences")
    .filter(Boolean) as string[];

  const result = createDonorSchema.safeParse({
    email: formData.get("email"),
    first_name: formData.get("first_name"),
    last_name: formData.get("last_name"),
    donation_preferences:
      donationPreferences.length > 0 ? donationPreferences : undefined,
  });

  if (!result.success) {
    return {
      error:
        "There were validation errors. Please check your input and try again.",
      success: false,
    };
  }

  const { error } = await supabase.auth.signInWithOtp({
    email: result.data.email,
    options: {
      data: {
        user_type: "donor",
        first_name: result.data.first_name,
        last_name: result.data.last_name,
        donation_preferences: result.data.donation_preferences,
      },
    },
  });

  if (error) {
    return {
      error: "Oops, something went wrong. Please try again.",
      success: false,
    };
  }

  // Redirect with email data
  return redirect(`/otp?email=${encodeURIComponent(result.data.email)}`);
}

export async function login(formData: FormData): Promise<ActionResponse> {
  const supabase = await createAnonymousServerSupabaseClient();

  const result = loginDonorSchema.safeParse({
    email: formData.get("email"),
  });

  if (!result.success) {
    return {
      error:
        "There were validation errors. Please check your input and try again.",
      success: false,
    };
  }

  const { error } = await supabase.auth.signInWithOtp({
    email: result.data.email,
    options: {
      shouldCreateUser: false,
    },
  });

  if (error) {
    return {
      error: "Oops, something went wrong. Please try again.",
      success: false,
    };
  }

  // Redirect with email data
  return redirect(`/otp?email=${encodeURIComponent(result.data.email)}`);
}
