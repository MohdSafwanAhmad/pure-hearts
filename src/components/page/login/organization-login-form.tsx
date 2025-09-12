"use client";
import { login } from "@/src/actions/auth";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import Image from "next/image";
import Link from "next/link";
import { useActionState } from "react";

export function OrganizationLoginForm() {
  const [loginState, loginAction, isLoginPending] = useActionState(
    login,
    undefined
  );

  return (
    <div className="flex flex-col gap-6">
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form action={loginAction} className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Organization Login</h1>
                <p className="text-muted-foreground text-balance">
                  Access your organization account
                </p>
              </div>

              {loginState?.errors && (
                <div className="text-sm text-red-500">
                  {typeof loginState.errors._form === "string"
                    ? loginState.errors._form
                    : loginState.errors._form?.map((error, i) => (
                        <p key={i}>{error}</p>
                      ))}
                </div>
              )}

              <div className="grid gap-3">
                <Label htmlFor="email">Organization Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="organization@example.com"
                  required
                />
                {loginState?.errors?.email && (
                  <p className="text-sm text-red-500">
                    {loginState.errors.email[0]}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoginPending}
              >
                {isLoginPending ? "Sending code..." : "Login"}
              </Button>

              <div className="text-center text-sm">
                Don&apos;t have an organization account?{" "}
                <Link href="/signup/organization" className="underline underline-offset-4">
                  Sign up
                </Link>
              </div>
            </div>
          </form>
          <div className="bg-muted relative hidden md:block">
            <Image
              src="/login-image.webp"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
              width={400}
              height={400}
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our{" "}
        <Link href="#">Terms of Service</Link> and{" "}
        <Link href="#">Privacy Policy</Link>.
      </div>
    </div>
  );
}