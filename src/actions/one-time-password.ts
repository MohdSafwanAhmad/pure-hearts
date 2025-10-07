"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createAnonymousServerSupabaseClient } from "@/src/lib/supabase/server";
import { ActionResponse } from "@/src/types/actions-types";
import { verifyOtpSchema } from "@/src/schemas/one-time-password";

export async function verifyOtp(formData: FormData): Promise<ActionResponse> {
  const supabase = await createAnonymousServerSupabaseClient();

  const result = verifyOtpSchema.safeParse({
    email: formData.get("email"),
    token: formData.get("token"),
  });

  if (!result.success) {
    return {
      error:
        "There were validation errors. Please check your input and try again.",
      success: false,
    };
  }

  const { error } = await supabase.auth.verifyOtp({
    email: result.data.email,
    token: result.data.token,
    type: "email",
  });

  if (error) {
    return {
      error: "Oops, something went wrong. Please try again.",
      success: false,
    };
  }

  revalidatePath("/", "layout");
  return redirect("/dashboard");
}
