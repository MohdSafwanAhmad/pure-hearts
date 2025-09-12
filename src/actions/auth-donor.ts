"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { createServerSupabaseClient } from "@/src/lib/supabase/server";

// Define the validation schema
const signupAsDonorAuthSchema = z.object({
  email: z.email("Please enter a valid email address"),
  first_name: z
    .string()
    .min(2, "First name must be at least 2 characters long"),
  last_name: z.string().min(2, "Last name must be at least 2 characters long"),
  donation_preferences: z.array(z.string()).optional(),
});

const loginAuthSchema = z.object({
  email: z.email("Please enter a valid email address"),
});

const verifyOtpSchema = z.object({
  email: z.email("Please enter a valid email address"),
  token: z
    .string()
    .min(6, "The code must be 6 characters")
    .max(6, "The code must be 6 characters"),
});

export async function login(
  prevState: unknown,
  formData: FormData
): Promise<{
  errors: Partial<Record<keyof z.infer<typeof loginAuthSchema>, string[]>> & {
    _form?: string[];
  };
}> {
  const supabase = await createServerSupabaseClient();

  const result = loginAuthSchema.safeParse({
    email: formData.get("email"),
  });

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
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
      errors: {
        _form: ["Oops! Something went wrong. Please try again."],
      },
    };
  }

  // Redirect with email data
  return redirect(`/otp?email=${encodeURIComponent(result.data.email)}`);
}

export async function signupAsDonor(
  prevState: unknown,
  formData: FormData
): Promise<{
  errors: Partial<
    Record<keyof z.infer<typeof signupAsDonorAuthSchema>, string[]>
  > & {
    _form?: string[];
  };
}> {
  const supabase = await createServerSupabaseClient();

  // Parse donation preferences from form data
  const donationPreferences = formData
    .getAll("donation_preferences")
    .filter(Boolean) as string[];

  const result = signupAsDonorAuthSchema.safeParse({
    email: formData.get("email"),
    first_name: formData.get("first_name"),
    last_name: formData.get("last_name"),
    donation_preferences:
      donationPreferences.length > 0 ? donationPreferences : undefined,
  });

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  const { error } = await supabase.auth.signInWithOtp({
    email: result.data.email,
    options: {
      data: {
        first_name: result.data.first_name,
        last_name: result.data.last_name,
        donation_preferences: result.data.donation_preferences,
      },
    },
  });

  if (error) {
    return {
      errors: {
        _form: ["Oops! Something went wrong. Please try again."],
      },
    };
  }

  // Redirect with email data
  return redirect(`/otp?email=${encodeURIComponent(result.data.email)}`);
}

export async function verifyOtp(
  prevState: unknown,
  formData: FormData
): Promise<{
  errors: Partial<Record<keyof z.infer<typeof verifyOtpSchema>, string[]>> & {
    _form?: string[];
  };
}> {
  const supabase = await createServerSupabaseClient();

  const result = verifyOtpSchema.safeParse({
    email: formData.get("email"),
    token: formData.get("token"),
  });

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  const { error } = await supabase.auth.verifyOtp({
    email: result.data.email,
    token: result.data.token,
    type: "email",
  });

  if (error) {
    return {
      errors: {
        _form: [error.message],
      },
    };
  }

  revalidatePath("/", "layout");
  return redirect("/dashboard");
}
