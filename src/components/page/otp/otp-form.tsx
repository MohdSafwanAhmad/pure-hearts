"use client";
import { verifyOtp } from "@/src/actions/auth-donor";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/src/components/ui/input-otp";
import { createBrowserSupabaseClient } from "@/src/lib/supabase/client";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";

export function OTPForm({ email }: { email: string }) {
  const [otpValue, setOtpValue] = useState("");
  const [countdown, setCountdown] = useState(30);
  const [resendDisabled, setResendDisabled] = useState(false);

  const [verifyState, verifyAction, isVerifyPending] = useActionState(
    verifyOtp,
    {
      errors: {},
    }
  );

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

  return (
    <div className="flex flex-col gap-6">
      <Card className="overflow-hidden p-0">
        <CardContent className="p-6 md:p-8">
          <form action={verifyAction} className="flex flex-col gap-6">
            <div className="flex flex-col items-center text-center">
              <h1 className="text-2xl font-bold">Verify your email</h1>
              <p className="text-muted-foreground text-balance">
                We sent a verification code to {email}
              </p>
            </div>

            {verifyState?.errors?._form && (
              <div className="text-sm text-red-500">
                {verifyState.errors._form.map((error, i) => (
                  <p key={i}>{error}</p>
                ))}
              </div>
            )}

            <input type="hidden" name="email" value={email} />
            <input type="hidden" name="token" value={otpValue} />

            <div className="grid gap-3">
              <div className="flex justify-center">
                <InputOTP maxLength={6} value={otpValue} onChange={setOtpValue}>
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
              {verifyState?.errors?.token && (
                <p className="text-sm text-red-500 text-center">
                  {verifyState.errors.token[0]}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isVerifyPending || otpValue.length !== 6}
            >
              {isVerifyPending ? "Verifying..." : "Verify Code"}
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
        </CardContent>
      </Card>
    </div>
  );
}
