"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { SearchBar } from "./search-bar";

export function SearchSection() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearch = (query: string, location: string) => {
    const params = new URLSearchParams(searchParams);

    if (query) {
      params.set("query", query);
    } else {
      params.delete("query");
    }

    if (location) {
      params.set("location", location);
    } else {
      params.delete("location");
    }

    // Reset to first page when search changes
    params.delete("page");

    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="mb-5">
      <SearchBar onSearch={handleSearch} />
    </div>
  );
}