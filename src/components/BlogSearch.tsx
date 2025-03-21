"use client";

import { useState } from "react";
import { HiSearch, HiX } from "react-icons/hi";

interface BlogSearchProps {
  onSearch: (query: string) => void;
}

export default function BlogSearch({ onSearch }: BlogSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const clearSearch = () => {
    setSearchQuery("");
    onSearch("");
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-full">
      <div className={`relative transition-all duration-300 ${isFocused ? 'ring-2 ring-blue-500' : ''}`}>
        <input
          type="text"
          placeholder="Search posts by title, description, or tags..."
          className="w-full px-4 py-3 pl-11 pr-12 text-base bg-[#121820] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none transition-all duration-200 focus:border-blue-600"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          aria-label="Search posts"
        />
        
        <div className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400">
          <HiSearch size={20} />
        </div>
        
        {searchQuery && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
            aria-label="Clear search"
          >
            <HiX size={18} />
          </button>
        )}
        
        <button
          type="submit"
          className="absolute right-3 top-1/2 transform -translate-y-1/2 px-2 py-1 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors focus:outline-none"
          aria-label="Submit search"
        >
          Search
        </button>
      </div>
    </form>
  );
} 