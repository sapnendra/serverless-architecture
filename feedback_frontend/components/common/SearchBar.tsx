"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";
import { useDebouncedThrottle } from "@/lib/hooks";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  debounceMs?: number;
  throttleMs?: number;
  isSearching?: boolean;
}

export function SearchBar({ 
  onSearch, 
  placeholder = "Search...",
  debounceMs = 500,
  throttleMs = 1000,
  isSearching = false,
}: SearchBarProps) {
  const [query, setQuery] = useState("");

  // Use debounced throttle hook for optimal search performance
  const throttledSearch = useDebouncedThrottle(onSearch, debounceMs, throttleMs);

  const handleChange = (value: string) => {
    setQuery(value);
    throttledSearch(value);
  };

  return (
    <div className="relative">
      {isSearching ? (
        <Loader2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
      ) : (
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      )}
      <Input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        className="pl-10"
      />
    </div>
  );
}
