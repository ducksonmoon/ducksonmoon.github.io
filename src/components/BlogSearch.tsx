"use client";

import { useState, useEffect } from "react";
import { HiSearch, HiX } from "react-icons/hi";

interface BlogSearchProps {
  onSearch: (query: string) => void;
}

export default function BlogSearch({ onSearch }: BlogSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkMobile();
    
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
      <div 
        className={`relative transition-all duration-300 rounded-lg overflow-hidden
        ${isFocused ? 'ring-2 ring-blue-500 shadow-lg shadow-blue-500/20' : 'shadow-md'}
        ${isFocused ? 'scale-[1.01]' : 'scale-100'}`}
      >
        <input
          type="text"
          placeholder={isMobile ? "Search posts..." : "Search posts by title, description, or tags..."}
          className="w-full px-4 py-3 pl-11 pr-16 text-base bg-[#121820] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none transition-all duration-200 focus:border-blue-600"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          aria-label="Search posts"
        />
        
        <div className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 flex items-center justify-center">
          <HiSearch className={`transition-all duration-300 ${isFocused ? 'text-blue-400' : 'text-gray-500'}`} size={20} />
        </div>
        
        {searchQuery && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-16 sm:right-20 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors p-1 hover:bg-gray-700 rounded-full"
            aria-label="Clear search"
          >
            <HiX size={16} />
          </button>
        )}
        
        <button
          type="submit"
          className={`absolute right-3 top-1/2 transform -translate-y-1/2 px-2 py-1 text-sm font-medium rounded-md bg-blue-600/10 
          ${isFocused ? 'text-blue-300 hover:bg-blue-600/20' : 'text-blue-400 hover:bg-blue-600/20'} 
          transition-all duration-200 focus:outline-none`}
          aria-label="Submit search"
        >
          <span className="hidden sm:inline">Search</span>
          <HiSearch className="sm:hidden" size={16} />
        </button>
      </div>
    </form>
  );
} 