"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { debounce } from "@/lib/utils";
import { MapPin, Search } from "lucide-react";
import { useCallback } from "react";

interface SearchBarProps {
  onSearch: (query: string, location: string) => void;
  isLoading?: boolean;
  placeholder?: {
    search?: string;
    location?: string;
  };
  className?: string;
}
export function SearchBar({
  onSearch,
  isLoading = false,
  placeholder = {
    search: "Search job titles or keywords",
    location: "Location or 'Remote'",
  },
  className = "",
}: SearchBarProps) {

  const debouncedSearch = useCallback(
    debounce((query: string, location: string) => {
      onSearch(query, location);
    }, 300),
    [onSearch]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const locationInput = document.querySelector<HTMLInputElement>('[name="location"]');
    debouncedSearch(e.target.value, locationInput?.value || "");
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchInput = document.querySelector<HTMLInputElement>('[name="search"]');
    debouncedSearch(searchInput?.value || "", e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const searchInput = form.querySelector<HTMLInputElement>('[name="search"]');
    const locationInput = form.querySelector<HTMLInputElement>('[name="location"]');
    onSearch(searchInput?.value || "", locationInput?.value || "");
  };
  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            name="search"
            placeholder={placeholder.search}
            className="pl-9"
            onChange={handleSearchChange}
          />
        </div>
        <div className="relative flex-1">
          <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            name="location"
            placeholder={placeholder.location}
            className="pl-9"
            onChange={handleLocationChange}
          />
        </div>
        <Button type="submit"
          className="sm:w-[120px]"
          disabled={isLoading}
        >
          {isLoading ? "Searching..." : "Search"}
        </Button>
      </div>
    </form>
  )
}
