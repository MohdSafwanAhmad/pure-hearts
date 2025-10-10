"use client";
import { verifyOtp } from "@/src/actions/one-time-password";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/src/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/src/components/ui/input-otp";
import { createBrowserSupabaseClient } from "@/src/lib/supabase/client";
import {
  verifyOtpSchema,
  TVerifyOtpSchema,
} from "@/src/schemas/one-time-password";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function OTPForm({ email }: { email: string }) {
  const [countdown, setCountdown] = useState(30);
  const [resendDisabled, setResendDisabled] = useState(false);

  const form = useForm<TVerifyOtpSchema>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: {
      email: email,
      token: "",
    },
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (resendDisabled) {
      interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setResendDisabled(false);
            return 30;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [resendDisabled]);

  const handleResendOTP = async () => {
    setResendDisabled(true);
    setCountdown(30);

    const supabase = createBrowserSupabaseClient();
    const { error } = await supabase.auth.signInWithOtp({
      email: email as string,
      options: {
        shouldCreateUser: false,
      },
    });

    if (error) {
      toast.error("Failed to resend OTP. Please try again.");
      return;
    }

    toast.success("OTP resent successfully.");
  };

  const onSubmit = async (data: TVerifyOtpSchema) => {
    const res = await verifyOtp(data);

    if (res?.error) {
      toast.error(res.error);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <Card className="overflow-hidden p-0">
        <CardContent className="p-6 md:p-8">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-6"
            >
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Verify your email</h1>
                <p className="text-muted-foreground text-balance">
                  We sent a verification code to {email}
                </p>
              </div>

              <FormField
                control={form.control}
                name="token"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex justify-center">
                        <InputOTP
                          maxLength={6}
                          value={field.value}
                          onChange={field.onChange}
                        >
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </div>
                    </FormControl>
                    <FormMessage className="text-center" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={
                  form.formState.isSubmitting ||
                  form.watch("token").length !== 6
                }
              >
                {form.formState.isSubmitting ? "Verifying..." : "Verify Code"}
              </Button>

              <div className="text-center text-sm">
                Didn&apos;t receive the code?{" "}
                <Button
                  type="button"
                  variant="link"
                  className="h-auto p-0 text-sm underline underline-offset-4 disabled:opacity-50"
                  disabled={resendDisabled}
                  onClick={handleResendOTP}
                >
                  {resendDisabled ? `Resend in ${countdown}s` : "Resend code"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
