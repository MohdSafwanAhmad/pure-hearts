"use client";

import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";

function cx(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

const PRESETS = [10, 50, 100];

// ⬇⬇⬇ Named export (not default)
export function DonationBox({
  defaultAmount = 50,
}: {
  defaultAmount?: number;
}) {
  const [amount, setAmount] = useState<number | "">(defaultAmount);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        {PRESETS.map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => setAmount(v)}
            className={cx(
              "h-10 rounded-md border text-sm font-medium transition",
              amount === v
                ? "border-primary bg-primary text-primary-foreground"
                : "bg-muted hover:bg-muted/80"
            )}
          >
            ${v}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <Input
          inputMode="decimal"
          value={amount}
          onChange={(e) => {
            const raw = e.target.value.replace(/[^\d.]/g, "");
            setAmount(raw === "" ? "" : Number(raw));
          }}
          placeholder="Enter amount"
          className="h-10"
        />
        <Button disabled={!amount} className="h-10">
          Donate
        </Button>
      </div>

    </div>
  );
}
