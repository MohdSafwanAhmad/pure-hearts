/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  upsertDonorProfile,
  deleteDonorProfile,
} from "@/src/actions/upsert-donor-profile";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Alert, AlertDescription } from "@/src/components/ui/alert";

type ProfileFormProps = {
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

// ---- small type guard so TS knows when a result is an error ----
function hasError(x: unknown): x is { error?: unknown } {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return !!x && typeof x === "object" && "error" in (x as any);
}

export default function ProfileForm({ userId, initial }: ProfileFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [formData, setFormData] = useState({
    first_name: initial.first_name ?? "",
    last_name: initial.last_name ?? "",
    phone: initial.phone ?? "",
    address: initial.address ?? "",
    city: initial.city ?? "",
    state: initial.state ?? "",
    country: initial.country ?? "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [profileCompleted, setProfileCompleted] = useState(
    initial.profile_completed
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await upsertDonorProfile({
        user_id: userId,
        ...formData,
      });

      // Narrow to error shape
      if (hasError(result)) {
        setError(String(result.error ?? "Something went wrong"));
        return;
      }

      // Success shape
      const wasCompleted = profileCompleted;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setProfileCompleted(Boolean((result as any).profile_completed));

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (!wasCompleted && (result as any).profile_completed) {
        setSuccess("Profile completed successfully!");
      } else {
        setSuccess("Profile updated successfully!");
      }
      startTransition(() => router.refresh());
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete your profile? This action cannot be undone."
      )
    ) {
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await deleteDonorProfile(userId);

      if (hasError(result)) {
        setError(String(result.error ?? "Failed to delete profile"));
        return;
      }

      setSuccess("Profile deleted successfully!");
      setProfileCompleted(false);
      setFormData({
        first_name: "",
        last_name: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        country: "",
      });
      startTransition(() => router.refresh());
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="first_name">First name</Label>
            <Input
              id="first_name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="last_name">Last name</Label>
            <Input
              id="last_name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        <div>
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="city">City / Province</Label>
            <Input
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="state">State</Label>
            <Input
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="country">Country</Label>
          <Input
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex gap-3 pt-4">
          {!profileCompleted && (
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Complete Profile"}
            </Button>
          )}

          {profileCompleted && (
            <>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Update Profile"}
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={isSubmitting}
              >
                Delete Profile
              </Button>
            </>
          )}
        </div>
      </form>
    </div>
  );
}
