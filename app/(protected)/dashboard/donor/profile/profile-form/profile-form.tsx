"use client";

import * as React from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { upsertDonorProfile } from "@/src/actions/upsert-donor-profile";
import { useTransition, useState } from "react";
// If you use sonner or any toast lib, feel free to use it:
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const notify = (msg: string) =>
  (window as any)?.toast?.success?.(msg) ?? alert(msg);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const notifyErr = (msg: string) =>
  (window as any)?.toast?.error?.(msg) ?? alert(msg);

type Initial = {
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state?: string | null;
  country: string | null;
  profile_completed?: boolean | null;
};

type Props = {
  userId: string;
  initial?: Initial;
};

export default function ProfileForm({ userId, initial }: Props) {
  const [form, setForm] = useState({
    first_name: initial?.first_name ?? "",
    last_name: initial?.last_name ?? "",
    phone: initial?.phone ?? "",
    address: initial?.address ?? "",
    city: initial?.city ?? "",
    state: initial?.state ?? "",
    country: initial?.country ?? "",
  });

  const [pending, start] = useTransition();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    start(async () => {
      const res = await upsertDonorProfile({ user_id: userId, ...form });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((res as any)?.error) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        notifyErr((res as any).error);
      } else {
        notify("Profile saved");
      }
    });
  };

  return (
    <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
      <div>
        <Label htmlFor="first_name">First name</Label>
        <Input
          id="first_name"
          name="first_name"
          value={form.first_name}
          onChange={onChange}
        />
      </div>

      <div>
        <Label htmlFor="last_name">Last name</Label>
        <Input
          id="last_name"
          name="last_name"
          value={form.last_name}
          onChange={onChange}
        />
      </div>

      <div className="sm:col-span-2">
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" name="phone" value={form.phone} onChange={onChange} />
      </div>

      <div className="sm:col-span-2">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          name="address"
          value={form.address}
          onChange={onChange}
        />
      </div>

      <div>
        <Label htmlFor="city">City / Province</Label>
        <Input id="city" name="city" value={form.city} onChange={onChange} />
      </div>

      <div>
        <Label htmlFor="state">State</Label>
        <Input id="state" name="state" value={form.state} onChange={onChange} />
      </div>

      <div className="sm:col-span-2">
        <Label htmlFor="country">Country</Label>
        <Input
          id="country"
          name="country"
          value={form.country}
          onChange={onChange}
        />
      </div>

      <div className="sm:col-span-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving..." : "Save profile"}
        </Button>
      </div>
    </form>
  );
}
