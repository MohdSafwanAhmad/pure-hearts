"use client";
import { signup, verifyOtp } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useActionState, useState } from "react"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import Image from "next/image";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
   const [otpValue, setOtpValue] = useState("");

  const [signupState, signupAction, isSignupPending] = useActionState(signup, {
    errors: {},
  });
  

  const [verifyState, verifyAction, isVerifyPending] = useActionState(verifyOtp, {
    errors: {},
  });

  // Show verification form if signup was successful
  if (signupState?.success && signupState?.step === "verify") {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card className="overflow-hidden p-0">
          <CardContent className="p-6 md:p-8">
            <form action={verifyAction} className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Verify your email</h1>
                <p className="text-muted-foreground text-balance">
                  We sent a verification code to {signupState.email}
                </p>
              </div>

              {verifyState?.errors?._form && (
                <div className="text-sm text-red-500">
                  {verifyState.errors._form.map((error, i) => (
                    <p key={i}>{error}</p>
                  ))}
                </div>
              )}

              <input type="hidden" name="email" value={signupState.email} />
              <input type="hidden" name="token" value={otpValue} />
              
              <div className="grid gap-3">
                <Label htmlFor="token">Verification Code</Label>
                <div className="flex justify-center">
                  <InputOTP
                    maxLength={6}
                    value={otpValue}
                    onChange={setOtpValue}
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
                {verifyState?.errors?.token && (
                  <p className="text-sm text-red-500 text-center">{verifyState.errors.token[0]}</p>
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
                <button 
                  type="button" 
                  className="underline underline-offset-4"
                  onClick={() => {
                    setOtpValue("");
                    window.location.reload();
                  }}
                >
                  Try again
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }
  
   return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form action={signupAction} className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Create your account</h1>
                <p className="text-muted-foreground text-balance">
                  Sign up for your Pure Zakat account
                </p>
              </div>
              
              {signupState?.errors?._form && (
                <div className="text-sm text-red-500">
                  {signupState.errors._form.map((error, i) => (
                    <p key={i}>{error}</p>
                  ))}
                </div>
              )}

              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
                {signupState?.errors?.email && (
                  <p className="text-sm text-red-500">{signupState.errors.email[0]}</p>
                )}
              </div>
              
              <div className="grid gap-3">
                <Label htmlFor="first_name">First Name</Label>
                <Input
                  id="first_name"
                  name="first_name"
                  type="text"
                  placeholder="John"
                  required
                />
                {signupState?.errors?.first_name && (
                  <p className="text-sm text-red-500">{signupState.errors.first_name[0]}</p>
                )}
              </div>
              
              <div className="grid gap-3">
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  name="last_name"
                  type="text"
                  placeholder="Doe"
                  required
                />
                {signupState?.errors?.last_name && (
                  <p className="text-sm text-red-500">{signupState.errors.last_name[0]}</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isSignupPending}>
                {isSignupPending ? "Sending code..." : "Sign up"}
              </Button>
              
              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link href="/login" className="underline underline-offset-4">
                  Login
                </Link>
              </div>
            </div>
          </form>
          <div className="bg-muted relative hidden md:block">
            <Image
              src="/signup-image.webp"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
              width={400}
              height={500}
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <Link href="#">Terms of Service</Link>{" "}
        and <Link href="#">Privacy Policy</Link>.
      </div>
    </div>
  )
}