"use client";

import { useState, useMemo } from "react";
import BlogCard from "@/components/BlogCard";
import BlogSearch from "@/components/BlogSearch";
import { Post } from "@/types/types";

export default function BlogList({ posts }: { posts: Post[] }) {
  const allTags = Array.from(new Set(posts.flatMap((post) => post.tags)));
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = useMemo(() => {
    let filtered = posts;
    
    // Filter by tag if selected
    if (selectedTag) {
      filtered = filtered.filter((post) => post.tags.includes(selectedTag));
    }
    
    // Filter by search query if provided
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.description.toLowerCase().includes(query) ||
          post.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }
    
    return filtered;
  }, [posts, selectedTag, searchQuery]);

  return (
    <div>
      {/* Search and Filter Section */}
      <div className="mb-8">
        {/* Search */}
        <div className="mb-6">
          <BlogSearch onSearch={setSearchQuery} />
        </div>
        
        {/* Tags */}
        <div className="mb-4">
          <h3 className="text-sm text-gray-400 mb-3">Filter by tag:</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedTag(null)}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${
                !selectedTag 
                  ? "bg-blue-600 text-white hover:bg-blue-700" 
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              All Posts
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${
                  selectedTag === tag 
                    ? "bg-blue-600 text-white hover:bg-blue-700" 
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Post Count */}
      <div className="mb-4 sm:mb-6 text-gray-400 text-xs sm:text-sm">
        {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'} 
        {selectedTag && ` tagged with #${selectedTag}`}
        {searchQuery && ` matching "${searchQuery}"`}
      </div>

      {/* Posts Grid */}
      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredPosts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 sm:py-16 bg-gray-900/30 rounded-lg border border-gray-800">
          <h3 className="text-lg sm:text-xl font-medium text-gray-300 mb-2">No posts found</h3>
          <p className="text-sm text-gray-400">
            Try adjusting your search or filter to find what you're looking for.
          </p>
        </div>
      )}
    </div>
  );
}
