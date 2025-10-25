"use client";

import { createCheckoutSession } from "@/src/actions/payment";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { donationSchema, DonationSchema } from "@/src/schemas/donation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface DonationFormProps {
  defaultAmount?: number;
  organizationName: string;
  organizationSlug: string;
  organizationId: string;
  organizationStripeAccountId: string;
  projectName: string;
  projectId: string;
  projectDescription: string;
}

export function DonationForm({
  defaultAmount = 50,
  organizationName,
  organizationSlug,
  organizationId,
  organizationStripeAccountId,
  projectName,
  projectId,
  projectDescription,
}: DonationFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<DonationSchema>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      donationAmount: defaultAmount,
      organizationName,
      organizationSlug,
      organizationId,
      organizationStripeAccountId,
      projectName,
      projectId,
      projectDescription,
    },
  });

  const donationAmount = form.watch("donationAmount");

  const onSubmit = async (values: DonationSchema) => {
    setIsLoading(true);

    try {
      await createCheckoutSession(values);
    } catch (error) {
      console.error("Error creating checkout session:", error);
      setIsLoading(false);
    }
  };

  const predefinedAmounts = [25, 50, 100, 250];

  return (
    <Card>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="donationAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg" htmlFor="donationAmountInput">
                    Enter a custom amount
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                        <span className="text-lg font-medium text-foreground">
                          $
                        </span>
                      </div>
                      <Input
                        {...field}
                        id="donationAmountInput"
                        type="text"
                        inputMode="numeric"
                        placeholder="0"
                        autoComplete="off"
                        className="pl-12 text-right !text-lg font-medium h-16 pr-4"
                        value={field.value || ""}
                        onChange={(e) => {
                          const value = e.target.value;

                          // Only allow integers
                          if (value === "" || /^\d+$/.test(value)) {
                            field.onChange(
                              value === "" ? 0 : parseInt(value, 10)
                            );
                          }
                        }}
                        onFocus={(e) => {
                          // Select all text on focus so typing replaces it
                          if (field.value === 0) {
                            e.target.select();
                          }
                        }}
                        onKeyDown={(e) => {
                          // Prevent any non-numeric characters
                          const allowedKeys = [
                            "Backspace",
                            "Delete",
                            "ArrowLeft",
                            "ArrowRight",
                            "Tab",
                          ];

                          if (
                            !allowedKeys.includes(e.key) &&
                            !/^\d$/.test(e.key)
                          ) {
                            e.preventDefault();
                          }
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-4 gap-2">
              {predefinedAmounts.map((amount) => (
                <Button
                  key={amount}
                  type="button"
                  variant={donationAmount === amount ? "default" : "outline"}
                  onClick={() => form.setValue("donationAmount", amount)}
                  className="h-10"
                >
                  ${amount}
                </Button>
              ))}
            </div>

            <div className="rounded-lg bg-muted p-4">
              <div className="flex justify-between text-sm">
                <span>Donation</span>
                <span>${donationAmount?.toFixed(2) || "0.00"}</span>
              </div>
              <div className="mt-3 pt-3 border-t flex justify-between font-medium">
                <span>Total</span>
                <span>${donationAmount.toFixed(2)}</span>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isLoading || !donationAmount || donationAmount === 0}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Donate Now"
              )}
            </Button>
          </form>
        </Form>

        <div className="mt-4 text-center text-xs text-muted-foreground">
          Your donation will be processed securely. You&apos;ll receive a
          confirmation receipt by email.
        </div>
      </CardContent>
    </Card>
  );
}
