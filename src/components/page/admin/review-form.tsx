"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { Button } from "@/src/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/src/components/ui/alert-dialog";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  verifyOrganizationSchema,
  TVerifyOrganizationSchema,
} from "@/src/schemas/verify-organization";

interface ReviewFormProps {
  organizationName: string;
  onApprove: (data: TVerifyOrganizationSchema) => Promise<void>;
  onReject: (
    data: TVerifyOrganizationSchema & { adminNotes: string },
  ) => Promise<void>;
}

export function ReviewForm({
  organizationName,
  onApprove,
  onReject,
}: ReviewFormProps) {
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  const form = useForm<TVerifyOrganizationSchema>({
    resolver: zodResolver(verifyOrganizationSchema),
    defaultValues: {
      reviewerFirstName: "",
      reviewerLastName: "",
      reviewerPhone: "",
      adminNotes: "",
    },
  });

  const handleApprove = async () => {
    const isValid = await form.trigger([
      "reviewerFirstName",
      "reviewerLastName",
      "reviewerPhone",
    ]);

    if (!isValid) {
      toast.error("Please fill in all reviewer information");
      return;
    }

    setIsApproving(true);
    try {
      await onApprove(form.getValues());
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async () => {
    const isValid = await form.trigger();

    if (!isValid) {
      toast.error("Please fill in all required fields");
      return;
    }

    const adminNotes = form.getValues("adminNotes");
    if (!adminNotes || adminNotes.trim().length < 10) {
      toast.error("Please provide rejection notes (at least 10 characters)");
      form.setError("adminNotes", {
        message: "Rejection notes must be at least 10 characters",
      });
      return;
    }

    setIsRejecting(true);
    try {
      await onReject(
        form.getValues() as TVerifyOrganizationSchema & { adminNotes: string },
      );
    } finally {
      setIsRejecting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Review Decision</CardTitle>
        <CardDescription>
          Fill in your information to approve or reject this verification
          request
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-6">
            <FormField
              control={form.control}
              name="reviewerFirstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your First Name *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="John" className="mt-2" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reviewerLastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Last Name *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Doe" className="mt-2" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reviewerPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Phone Number *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="+15554443333"
                      className="mt-2"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="adminNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Rejection Notes (required only for rejection)
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Explain why this verification was rejected..."
                      rows={4}
                      className="mt-2"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="pt-4 space-y-3">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    type="button"
                    className="w-full bg-green-600 hover:bg-green-700"
                    disabled={isApproving || isRejecting}
                  >
                    {isApproving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Approving...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Approve Organization
                      </>
                    )}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Approve Organization?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will mark <strong>{organizationName}</strong> as
                      verified. The organization will be able to create projects
                      and receive donations. This action cannot be undone
                      easily.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleApprove}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Yes, Approve
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    type="button"
                    variant="destructive"
                    className="w-full"
                    disabled={isApproving || isRejecting}
                  >
                    {isRejecting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Rejecting...
                      </>
                    ) : (
                      <>
                        <XCircle className="mr-2 h-4 w-4" />
                        Reject Organization
                      </>
                    )}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Reject Organization?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will reject the verification request for{" "}
                      <strong>{organizationName}</strong>. The organization will
                      be notified and can submit a new request with updated
                      documentation. Make sure you&apos;ve filled in the
                      rejection notes.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleReject}
                      className="bg-destructive hover:bg-destructive/90"
                    >
                      Yes, Reject
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
