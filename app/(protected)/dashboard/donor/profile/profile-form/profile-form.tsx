"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  upsertDonorProfile,
  deleteDonorProfile,
} from "@/src/actions/upsert-donor-profile";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Alert, AlertDescription } from "@/src/components/ui/alert";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/src/components/ui/alert-dialog";
import {
  donorProfileSchema,
  TDonorProfileSchema,
  CA_PROVINCES_TO_CITIES,
  CANADIAN_PROVINCES,
} from "@/src/schemas/donor";

type Props = {
  userId: string;
  initial: {
    first_name: string | null;
    last_name: string | null;
    phone: string | null;
    address: string | null;
    city: string | null;
    state: string | null;
    country: string | null;
    profile_completed: boolean;
    postal_code: string | null;
  };
};

export default function ProfileForm({ initial }: Props) {
  const router = useRouter();

  // Start in edit mode if profile is not completed
  const [editMode, setEditMode] = useState(!initial.profile_completed);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [serverSuccess, setServerSuccess] = useState<string | null>(null);

  const defaultValues: TDonorProfileSchema = {
    first_name: initial.first_name ?? "",
    last_name: initial.last_name ?? "",
    phone: initial.phone ?? "",
    address: initial.address ?? "",
    state:
      initial.state && CANADIAN_PROVINCES.includes(initial.state)
        ? initial.state
        : "",
    city: initial.city ?? "",
    country: "Canada",
    postal_code: initial.postal_code ?? "",
  };

  const form = useForm<TDonorProfileSchema>({
    resolver: zodResolver(donorProfileSchema),
    defaultValues,
    mode: "onChange",
  });

  const { handleSubmit, reset, watch, formState } = form;
  const { isDirty, isValid, isSubmitting } = formState;

  // Province selected → compute city options
  const selectedProvince = watch("state");
  const cityOptions = useMemo(
    () =>
      selectedProvince ? CA_PROVINCES_TO_CITIES[selectedProvince] ?? [] : [],
    [selectedProvince]
  );

  // If province changes and current city isn't valid, clear it
  useEffect(() => {
    const currentCity = watch("city");
    if (selectedProvince && currentCity) {
      const allowed = CA_PROVINCES_TO_CITIES[selectedProvince] ?? [];
      if (!allowed.includes(currentCity)) {
        form.setValue("city", "", { shouldDirty: true, shouldValidate: true });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProvince]);

  async function onSubmit(values: TDonorProfileSchema) {
    setServerError(null);
    setServerSuccess(null);

    const res = await upsertDonorProfile({
      ...values,
      profile_completed: true,
    });

    if ("error" in res) {
      setServerError(res.error ?? "Something went wrong");
      return;
    }

    setServerSuccess(
      initial.profile_completed
        ? "Profile updated successfully!"
        : "Profile completed successfully!"
    );
    setEditMode(false);
    reset(values);
    router.refresh();
  }

  async function handleDelete() {
    setServerError(null);
    setServerSuccess(null);

    const res = await deleteDonorProfile();
    if ("error" in res) {
      setServerError(res.error ?? "Failed to delete profile");
      setShowDeleteDialog(false);
      return;
    }

    setServerSuccess("Profile deleted successfully");
    setEditMode(true);
    reset({
      first_name: "",
      last_name: "",
      phone: "",
      address: "",
      state: "",
      city: "",
      country: "Canada",
      postal_code: "",
    });
    setShowDeleteDialog(false);
    router.refresh();
  }

  function handleCancel() {
    reset(defaultValues);
    setServerError(null);
    setServerSuccess(null);
    // Only exit edit mode if profile is already completed
    if (initial.profile_completed) {
      setEditMode(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Page header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Donor Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Review and update your personal information
          </p>
        </div>

        {/* Show Edit/Delete buttons only when profile is completed AND not in edit mode */}
        {!editMode && initial.profile_completed && (
          <div className="flex gap-3">
            <Button type="button" onClick={() => setEditMode(true)}>
              Edit Profile
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => setShowDeleteDialog(true)}
            >
              Delete Profile
            </Button>
          </div>
        )}
      </div>

      {serverError && (
        <Alert variant="destructive">
          <AlertDescription>{serverError}</AlertDescription>
        </Alert>
      )}
      {serverSuccess && (
        <Alert>
          <AlertDescription>{serverSuccess}</AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First name *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={!editMode || isSubmitting}
                          placeholder="Enter your first name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last name *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={!editMode || isSubmitting}
                          placeholder="Enter your last name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value ?? ""}
                        type="tel"
                        disabled={!editMode || isSubmitting}
                        placeholder="+12345678901"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Location */}
          <Card>
            <CardHeader>
              <CardTitle>Location</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Input value="Canada" disabled className="bg-muted" />
                </FormControl>
              </FormItem>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State / Province *</FormLabel>
                      <Select
                        disabled={!editMode || isSubmitting}
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a province" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {CANADIAN_PROVINCES.map((prov) => (
                            <SelectItem key={prov} value={prov}>
                              {prov}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City *</FormLabel>
                      <Select
                        disabled={
                          !editMode || isSubmitting || !selectedProvince
                        }
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={
                                selectedProvince
                                  ? "Select a city"
                                  : "Select a province first"
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {(cityOptions.length ? cityOptions : []).map((c) => (
                            <SelectItem key={c} value={c}>
                              {c}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Street Address *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={!editMode || isSubmitting}
                        placeholder="e.g., 101 Zakat Crescent"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="postal_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Postal Code *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={!editMode || isSubmitting}
                        placeholder="e.g., A1A 1A1"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Action Buttons - Only show when in edit mode */}
          {editMode && (
            <div className="flex justify-between items-center pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={!isValid || isSubmitting || !isDirty}
              >
                {initial.profile_completed
                  ? isSubmitting
                    ? "Updating..."
                    : "Save Changes"
                  : isSubmitting
                  ? "Saving..."
                  : "Complete Profile"}
              </Button>
            </div>
          )}
        </form>
      </Form>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              donor profile and remove all your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Profile
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
