"use client";

import { useState } from "react";
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

// helper to always get a string out of unknown/any error shapes
const toErrorString = (e: unknown) =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  typeof e === "string" ? e : (e as any)?.message ?? "Something went wrong";

export default function ProfileForm({ userId, initial }: ProfileFormProps) {
  const router = useRouter();

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

  // When profile is already completed, start locked (not editable).
  // When not completed yet, start editable.
  const [profileCompleted, setProfileCompleted] = useState(
    initial.profile_completed
  );
  const [editMode, setEditMode] = useState(!initial.profile_completed); // <-- only ONE declaration

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editMode) return; // ignore edits while locked
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editMode) return; // should never happen, but prevents accidental submits when locked

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    const result = await upsertDonorProfile({
      user_id: userId,
      ...formData,
    });

    setIsSubmitting(false);

    if ("error" in result && result.error) {
      setError(toErrorString(result.error)); // <-- coerce to string
      return;
    }

    const wasCompleted = profileCompleted;
    setProfileCompleted(result.profile_completed ?? false);

    if (!wasCompleted && result.profile_completed) {
      setSuccess("Profile completed successfully!");
      setEditMode(false); // lock after first completion
    } else {
      setSuccess("Profile updated successfully!");
      setEditMode(false); // lock again after update
    }

    router.refresh();
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

    const result = await deleteDonorProfile(userId);

    setIsSubmitting(false);

    if ("error" in result && result.error) {
      setError(toErrorString(result.error)); // <-- coerce to string
      return;
    }

    setSuccess("Profile deleted successfully!");
    setProfileCompleted(false);
    setEditMode(true); // allow editing to re-create the profile
    setFormData({
      first_name: "",
      last_name: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      country: "",
    });

    router.refresh();
  };

  // Cancel editing: discard changes and lock again
  const handleCancel = () => {
    setError(null);
    setSuccess(null);
    setFormData({
      first_name: initial.first_name ?? "",
      last_name: initial.last_name ?? "",
      phone: initial.phone ?? "",
      address: initial.address ?? "",
      city: initial.city ?? "",
      state: initial.state ?? "",
      country: initial.country ?? "",
    });
    setEditMode(false);
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

      {/* Toolbar: Edit / Cancel */}
      <div className="flex items-center gap-3">
        {!editMode && profileCompleted && (
          <Button
            type="button"
            variant="outline"
            onClick={() => setEditMode(true)}
          >
            Edit profile
          </Button>
        )}
        {editMode && profileCompleted && (
          <Button type="button" variant="ghost" onClick={handleCancel}>
            Cancel
          </Button>
        )}
      </div>

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
              disabled={!editMode}
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
              disabled={!editMode}
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
            disabled={!editMode}
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
            disabled={!editMode}
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
              disabled={!editMode}
            />
          </div>

          <div>
            <Label htmlFor="state">State</Label>
            <Input
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              disabled={!editMode}
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
            disabled={!editMode}
          />
        </div>

        <div className="flex gap-3 pt-4">
          {/* Primary action */}
          <Button type="submit" disabled={isSubmitting || !editMode}>
            {isSubmitting
              ? profileCompleted
                ? "Updating..."
                : "Saving..."
              : profileCompleted
              ? "Update Profile"
              : "Complete Profile"}
          </Button>

          {/* Destructive action (only when a profile exists) */}
          {profileCompleted && (
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={isSubmitting}
            >
              Delete Profile
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
