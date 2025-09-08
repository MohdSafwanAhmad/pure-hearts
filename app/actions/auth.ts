"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { createServerSupabaseClient } from "@/utils/supabase/server";

// Define the validation schema
const signupAuthSchema = z.object({
    email: z.email("Please enter a valid email address"),
    "first_name": z.string().min(
        2,
        "First name must be at least 2 characters long",
    ),
    "last_name": z.string().min(
        2,
        "Last name must be at least 2 characters long",
    ),
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

// Define the return types of the actions
type LoginResult = {
    success: boolean;
    step?: "verify";
    formData?: z.infer<typeof loginAuthSchema>;
    message?: string;
    errors: Partial<Record<keyof z.infer<typeof loginAuthSchema>, string[]>> & {
        _form?: string[];
    };
};

type VerifyOtpResult = {
    errors: Partial<Record<keyof z.infer<typeof verifyOtpSchema>, string[]>> & {
        _form?: string[];
    };
};

type SignupResult = {
    success?: boolean;
    step?: "verify";
    email?: string;
    first_name?: string;
    last_name?: string;
    message?: string;
    errors:
        & Partial<Record<keyof z.infer<typeof signupAuthSchema>, string[]>>
        & {
            _form?: string[];
        };
};
export async function login(
    prevState: unknown,
    formData: FormData,
): Promise<LoginResult> {
    const supabase = await createServerSupabaseClient();

    const result = loginAuthSchema.safeParse({
        email: formData.get("email"),
    });

    if (!result.success) {
        return {
            success: false,
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
            success: false,
            errors: {
                _form: ["Oops! Something went wrong. Please try again."],
            },
        };
    }

    return {
        success: true,
        step: "verify",
        formData: { email: result.data.email },
        message: "Check your email for the login code!",
        errors: {},
    };
}

export async function signup(
    prevState: unknown,
    formData: FormData,
): Promise<SignupResult> {
    const supabase = await createServerSupabaseClient();

    const result = signupAuthSchema.safeParse({
        email: formData.get("email"),
        first_name: formData.get("first_name"),
        last_name: formData.get("last_name"),
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

    return {
        success: true,
        step: "verify",
        email: result.data.email,
        first_name: result.data.first_name,
        last_name: result.data.last_name,
        message: "Check your email for the verification code!",
        errors: {},
    };
}

export async function verifyOtp(
    prevState: unknown,
    formData: FormData,
): Promise<VerifyOtpResult> {
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
    redirect("/dashboard");
}
