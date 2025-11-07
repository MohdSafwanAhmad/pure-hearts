"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/src/lib/utils";
import { Search } from "lucide-react";
import { Input } from "@/src/components/ui/input";

interface SearchBoxProps {
  className?: string;
}

/**
 * Navbar/mobile search box.
 * - Redirects to /campaigns/search?q=...
 * - Clears its own input after redirect to avoid confusion with CampaignSearchPage
 */
export default function SearchBox({ className }: SearchBoxProps) {
  const router = useRouter();
  const [q, setQ] = React.useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const query = q.trim();
    if (!query) return;

    router.push(`/campaigns/search?q=${encodeURIComponent(query)}`);
    setQ(""); // clear the navbar search input
  };

  return (
    <form onSubmit={handleSubmit} className={cn("relative", className)}>
      <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search campaigns..."
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
