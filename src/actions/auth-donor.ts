"use server";

import { redirect } from "next/navigation";

import { createAnonymousServerSupabaseClient } from "@/src/lib/supabase/server";
import { ActionResponse } from "@/src/types/actions-types";
import { createDonorSchema, loginDonorSchema } from "@/src/schemas/donor";

export async function signupAsDonor(
  data: Record<string, unknown>
): Promise<ActionResponse> {
  // 1) Create anonymous supabase client
  const supabase = await createAnonymousServerSupabaseClient();

  // 2) Validate data
  const result = createDonorSchema.safeParse(data);

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

export async function loginAsDonor(
  data: Record<string, unknown>
): Promise<ActionResponse> {
  // 1) Create anonymous supabase client
  const supabase = await createAnonymousServerSupabaseClient();

  // 2) Validate data
  const result = loginDonorSchema.safeParse(data);

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
