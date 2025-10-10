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
  };
};

export default function ProfileForm({ initial }: Props) {
  const router = useRouter();

  // Start locked if already completed
  const [editMode, setEditMode] = useState(
    !initial.profile_completed ? true : false
  );
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

  async function onDelete() {
    if (!confirm("Delete your profile? This cannot be undone.")) return;
    setServerError(null);
    setServerSuccess(null);

    const res = await deleteDonorProfile();
    if ("error" in res) {
      setServerError(res.error ?? "Failed to delete profile");
      return;
    }

    setServerSuccess("Profile deleted");
    setEditMode(true);
    reset({
      first_name: "",
      last_name: "",
      phone: "",
      address: "",
      state: "",
      city: "",
      country: "Canada",
    });
    router.refresh();
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

        {!editMode && initial.profile_completed && (
          <div className="flex gap-3">
            <Button type="button" onClick={() => setEditMode(true)}>
              Edit Profile
            </Button>
            <Button type="button" variant="destructive" onClick={onDelete}>
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
                        placeholder="+1 234 567 8901"
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
                        disabled={!editMode || isSubmitting || !selectedProvince}
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
            </CardContent>
          </Card>

          {/* Actions */}
          {editMode && (
            <div className="flex justify-between items-center pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  reset(defaultValues);
                  setServerError(null);
                  setServerSuccess(null);
                  setEditMode(!initial.profile_completed ? true : false);
                }}
                disabled={isSubmitting || (!isDirty && initial.profile_completed)}
              >
                Cancel
              </Button>

              <div className="flex gap-3">
                {initial.profile_completed && (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={onDelete}
                    disabled={isSubmitting}
                  >
                    Delete Profile
                  </Button>
                )}

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
            </div>
          )}
        </form>
      </Form>
    </div>
  );
}