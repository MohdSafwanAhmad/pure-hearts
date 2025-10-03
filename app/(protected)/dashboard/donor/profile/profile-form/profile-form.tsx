"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  upsertDonorProfile,
  deleteDonorProfile,
} from "@/src/actions/upsert-donor-profile";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
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

/* ------------------------------------------------------------------ */
/* Canada provinces and a simple city list for each (extend as needed) */
/* ------------------------------------------------------------------ */
const CA_PROVINCES_TO_CITIES: Record<string, string[]> = {
  Alberta: ["Calgary", "Edmonton", "Red Deer", "Lethbridge", "Medicine Hat"],
  "British Columbia": ["Vancouver", "Victoria", "Kelowna", "Surrey", "Burnaby"],
  Manitoba: ["Winnipeg", "Brandon", "Steinbach"],
  "New Brunswick": ["Moncton", "Saint John", "Fredericton"],
  "Newfoundland and Labrador": ["St. John's", "Corner Brook", "Gander"],
  "Nova Scotia": ["Halifax", "Sydney", "Truro"],
  Ontario: [
    "Toronto",
    "Ottawa",
    "Mississauga",
    "Brampton",
    "Hamilton",
    "London",
  ],
  "Prince Edward Island": ["Charlottetown", "Summerside"],
  Quebec: ["Montreal", "Quebec City", "Laval", "Gatineau", "Longueuil"],
  Saskatchewan: ["Saskatoon", "Regina", "Prince Albert"],
  "Northwest Territories": ["Yellowknife", "Hay River"],
  Nunavut: ["Iqaluit"],
  Yukon: ["Whitehorse"],
};

const CANADIAN_PROVINCES = Object.keys(CA_PROVINCES_TO_CITIES);

/* -------------------- */
/* Validation (Zod)     */
/* -------------------- */
const ProfileSchema = z.object({
  first_name: z.string().min(1, "First name is required").trim(),
  last_name: z.string().min(1, "Last name is required").trim(),
  phone: z.string().optional().nullable(),
  address: z.string().min(1, "Address is required").trim(),
  // Province/state required; must be one of our list
  state: z
    .string()
    .min(1, "State/Province is required")
    .refine((v) => CANADIAN_PROVINCES.includes(v), {
      message: "Please select a valid province",
    }),
  // City required; we’ll validate it belongs to selected province
  city: z.string().min(1, "City is required"),
  // Country fixed to Canada, but keep for type completeness
  country: z.literal("Canada"),
});

type ProfileValues = z.infer<typeof ProfileSchema>;

type Props = {
  userId: string;
  initial: {
    first_name: string | null;
    last_name: string | null;
    phone: string | null;
    address: string | null;
    city: string | null;
    state: string | null;
    country: string | null; // we will pin to Canada in the UI
    profile_completed: boolean;
  };
};

export default function ProfileForm({ userId, initial }: Props) {
  const router = useRouter();

  // Start locked if already completed
  const [editMode, setEditMode] = useState(
    !initial.profile_completed ? true : false
  );
  const [serverError, setServerError] = useState<string | null>(null);
  const [serverSuccess, setServerSuccess] = useState<string | null>(null);

  const defaultValues: ProfileValues = {
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

  const form = useForm<ProfileValues>({
    resolver: zodResolver(
      ProfileSchema.superRefine((val, ctx) => {
        // ensure city belongs to chosen province (if province chosen)
        if (val.state) {
          const allowed = CA_PROVINCES_TO_CITIES[val.state] ?? [];
          if (allowed.length && !allowed.includes(val.city)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ["city"],
              message: `Please select a valid city in ${val.state}`,
            });
          }
        }
      })
    ),
    defaultValues,
    mode: "onChange",
  });

  const { register, handleSubmit, control, reset, watch, formState } = form;
  const { isDirty, isValid, isSubmitting } = formState;

  // Province selected → compute city options
  const selectedProvince = watch("state");
  const cityOptions = useMemo(
    () =>
      selectedProvince ? CA_PROVINCES_TO_CITIES[selectedProvince] ?? [] : [],
    [selectedProvince]
  );

  // If province changes and current city isn’t valid, clear it
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

  async function onSubmit(values: ProfileValues) {
    setServerError(null);
    setServerSuccess(null);

    const res = await upsertDonorProfile({
      user_id: userId,
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
    reset(values); // keep tidy
    router.refresh();
  }

  async function onDelete() {
    if (!confirm("Delete your profile? This cannot be undone.")) return;
    setServerError(null);
    setServerSuccess(null);

    const res = await deleteDonorProfile(userId);
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
      {/* Page header (similar to org) */}
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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="first_name">First name *</Label>
                <Input
                  id="first_name"
                  disabled={!editMode || isSubmitting}
                  {...register("first_name")}
                />
              </div>
              <div>
                <Label htmlFor="last_name">Last name *</Label>
                <Input
                  id="last_name"
                  disabled={!editMode || isSubmitting}
                  {...register("last_name")}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                disabled={!editMode || isSubmitting}
                {...register("phone")}
                placeholder="+1 234 567 8901"
              />
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card>
          <CardHeader>
            <CardTitle>Location</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Country</Label>
              <Input value="Canada" disabled className="bg-muted" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="state">State / Province *</Label>
                <Controller
                  control={control}
                  name="state"
                  render={({ field }) => (
                    <Select
                      disabled={!editMode || isSubmitting}
                      onValueChange={(v) => field.onChange(v)}
                      value={field.value}
                    >
                      <SelectTrigger id="state">
                        <SelectValue placeholder="Select a province" />
                      </SelectTrigger>
                      <SelectContent>
                        {CANADIAN_PROVINCES.map((prov) => (
                          <SelectItem key={prov} value={prov}>
                            {prov}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div>
                <Label htmlFor="city">City *</Label>
                <Controller
                  control={control}
                  name="city"
                  render={({ field }) => (
                    <Select
                      disabled={!editMode || isSubmitting || !selectedProvince}
                      onValueChange={(v) => field.onChange(v)}
                      value={field.value}
                    >
                      <SelectTrigger id="city">
                        <SelectValue
                          placeholder={
                            selectedProvince
                              ? "Select a city"
                              : "Select a province first"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {(cityOptions.length ? cityOptions : []).map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address">Street Address *</Label>
              <Input
                id="address"
                disabled={!editMode || isSubmitting}
                {...register("address")}
                placeholder="e.g., 101 Zakat Crescent"
              />
            </div>
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
                // If it was already completed, return to locked view
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
    </div>
  );
}
