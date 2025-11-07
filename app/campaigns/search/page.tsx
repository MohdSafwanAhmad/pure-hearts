"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";

/**
 * Campaign/project type returned by the API
 */
interface Campaign {
  id: string;
  title: string;
  description: string;
  projectslug: string;   // backend changed from 'slug' to 'projectslug'
  image_url: string | null; // backend returns 'image_url'
  orgslug: string;       // backend returns 'orgslug'
}

/** Number of campaigns per page for pagination */
const CAMPAIGNS_PER_PAGE = 6;

export default function CampaignSearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchInputRef = useRef<HTMLInputElement>(null); // ref for input focus

  // Initialize state from URL params
  const initialQuery = searchParams.get("q") || "";
  const initialSort = searchParams.get("sort") || "relevance";
  const initialCategory = searchParams.get("category") || "";

  const [query, setQuery] = useState(initialQuery);
  const [sort, setSort] = useState(initialSort);
  const [category, setCategory] = useState(initialCategory);
  const [results, setResults] = useState<Campaign[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  /** Focus the main input on mount and place cursor at end */
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
      const len = searchInputRef.current.value.length;
      searchInputRef.current.setSelectionRange(len, len);
    }
  }, []);

  /** Update URL parameters without page reload */
  const updateSearchParams = (newQuery: string, newSort: string, newCategory: string, page: number) => {
    const params = new URLSearchParams();
    if (newQuery) params.set("q", newQuery);
    if (newSort) params.set("sort", newSort);
    if (newCategory) params.set("category", newCategory);
    if (page > 1) params.set("page", page.toString());
    router.replace(`/campaigns/search?${params.toString()}`);
  };

  /** Fetch campaigns from backend API */
  const fetchCampaigns = async () => {
    if (!query.trim() && !category) {
      setResults([]);
      setCategories([]);
      return;
    }

    setLoading(true);
    try {
      const url = new URL("/api/campaigns/search", window.location.origin);
      url.searchParams.set("q", query);
      url.searchParams.set("sort", sort);
      if (category) url.searchParams.set("category", category);

      const res = await fetch(url.toString());
      if (!res.ok) throw new Error("Failed to fetch campaigns");

      const data = await res.json();
      setResults(data.results || []);
      setCategories(data.categories || []);
      setCurrentPage(1); // reset pagination
    } catch (err) {
      console.error("Error fetching campaigns:", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Refetch whenever query, sort, or category changes
  useEffect(() => {
    fetchCampaigns();
  }, [query, sort, category]);

  /** Handle clicking a campaign card */
  const handleCardClick = (orgslug: string, projectslug: string) => {
    router.push(`/campaigns/${orgslug}/${projectslug}`);
  };

  /** Clear filters */
  const handleClear = () => {
    setQuery("");
    setCategory("");
    setSort("relevance");
    setResults([]);
    setCurrentPage(1);
    router.replace("/campaigns/search");
  };

  // Pagination calculations
  const startIndex = (currentPage - 1) * CAMPAIGNS_PER_PAGE;
  const endIndex = startIndex + CAMPAIGNS_PER_PAGE;
  const paginatedResults = results.slice(startIndex, endIndex);
  const totalPages = Math.ceil(results.length / CAMPAIGNS_PER_PAGE);

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Search Campaigns</h1>

      {/* Search & Controls */}
      <div className="flex flex-col md:flex-row gap-2 items-start md:items-center">
        <Input
          ref={searchInputRef} // <-- attach ref here
          type="text"
          placeholder="Enter a campaign title, description, or keyword"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1"
        />

        <Select value={sort} onValueChange={(val) => setSort(val)}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="relevance">Relevance (Default)</SelectItem>
            <SelectItem value="newest">Published Date (Newest)</SelectItem>
          </SelectContent>
        </Select>

        {categories.length > 0 && (
          <Select value={category} onValueChange={(val) => setCategory(val)}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <Button variant="secondary" onClick={handleClear}>
          Clear
        </Button>
      </div>

      {/* Campaign Results */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading && <p>Loading campaigns...</p>}
        {!loading && paginatedResults.length === 0 && <p>No campaigns found.</p>}

        {!loading &&
          paginatedResults.map((c: Campaign) => (
            <Card
              key={c.id}
              onClick={() => handleCardClick(c.orgslug, c.projectslug)}
              className="cursor-pointer hover:shadow-lg transition-shadow"
            >
              <CardContent className="p-4">
                {c.image_url && (
                  <img
                    src={c.image_url}
                    alt={c.title}
                    className="w-full h-40 object-cover rounded-lg mb-2"
                  />
                )}
                <h2 className="text-lg font-semibold">{c.title}</h2>
                <p className="text-sm text-muted-foreground line-clamp-2">{c.description}</p>
              </CardContent>
            </Card>
          ))}
      </section>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex gap-2 justify-center mt-4">
          <Button onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))} disabled={currentPage === 1}>
            Prev
          </Button>
          {Array.from({ length: totalPages }, (_, i) => (
            <Button
              key={i + 1}
              variant={currentPage === i + 1 ? "default" : "outline"}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </Button>
          ))}
          <Button onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))} disabled={currentPage === totalPages}>
            Next
          </Button>
        </div>
      )}
    </main>
  );
}
