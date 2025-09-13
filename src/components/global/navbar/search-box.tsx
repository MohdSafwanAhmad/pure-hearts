"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/src/lib/utils";
import { Search } from "lucide-react";
import { Input } from "@/src/components/ui/input";

export default function SearchBox({ className }: { className?: string }) {
  const router = useRouter();
  const [q, setQ] = React.useState("");

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const query = q.trim();
    if (query) router.push(`/search?q=${encodeURIComponent(query)}`);
  }

  return (
    <form onSubmit={onSubmit} className={cn("relative", className)}>
      <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        inputMode="search"
        placeholder="Search"
        aria-label="Search"
        className="w-full pl-9"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <button type="submit" className="sr-only">
        Search
      </button>
    </form>
  );
}
