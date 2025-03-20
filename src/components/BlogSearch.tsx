"use client";

import { useState } from "react";
import { HiSearch } from "react-icons/hi";

interface BlogSearchProps {
  onSearch: (query: string) => void;
}

export default function BlogSearch({ onSearch }: BlogSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-full sm:max-w-md">
      <div className="relative">
        <input
          type="text"
          placeholder="Search posts..."
          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pl-9 sm:pl-10 pr-12 text-sm sm:text-base bg-[#161b22] border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
          <HiSearch size={16} className="sm:hidden" />
          <HiSearch size={18} className="hidden sm:block" />
        </div>
        <button
          type="submit"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 px-2 py-1 text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors"
        >
          Search
        </button>
      </div>
    </form>
  );
} 