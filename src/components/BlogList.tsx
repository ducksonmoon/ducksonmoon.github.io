"use client";

import { useState, useMemo } from "react";
import BlogCard from "@/components/BlogCard";
import BlogSearch from "@/components/BlogSearch";
import { Post } from "@/types/types";

export default function BlogList({ posts }: { posts: Post[] }) {
  const allTags = Array.from(new Set(posts.flatMap((post) => post.tags)));
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [displayMode, setDisplayMode] = useState<"grid" | "list">("grid");

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
      <div className="mb-8 bg-[#1a1f27] rounded-xl p-6 border border-gray-800 shadow-md">
        <div className="sm:flex sm:items-center sm:justify-between sm:mb-6">
          <h2 className="text-xl font-bold text-white mb-4 sm:mb-0">Browse Articles</h2>
          
          {/* View Mode Selector */}
          <div className="flex items-center space-x-2 mb-4 sm:mb-0">
            <button
              onClick={() => setDisplayMode("grid")}
              className={`p-2 rounded-md transition-colors ${
                displayMode === "grid"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
              aria-label="Grid view"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
            </button>
            <button
              onClick={() => setDisplayMode("list")}
              className={`p-2 rounded-md transition-colors ${
                displayMode === "list"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
              aria-label="List view"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="8" y1="6" x2="21" y2="6"></line>
                <line x1="8" y1="12" x2="21" y2="12"></line>
                <line x1="8" y1="18" x2="21" y2="18"></line>
                <line x1="3" y1="6" x2="3" y2="6"></line>
                <line x1="3" y1="12" x2="3" y2="12"></line>
                <line x1="3" y1="18" x2="3" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
        
        {/* Search */}
        <div className="mb-6">
          <BlogSearch onSearch={setSearchQuery} />
        </div>
        
        {/* Tags */}
        <div>
          <h3 className="text-sm text-gray-400 mb-3 font-medium">Filter by tag:</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedTag(null)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
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
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
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
      <div className="mb-6 pb-4 border-b border-gray-800 text-gray-400 text-sm flex items-center justify-between">
        <div>
          <span className="font-medium text-white">{filteredPosts.length}</span> {filteredPosts.length === 1 ? 'post' : 'posts'} 
          {selectedTag && <span className="ml-1">tagged with <span className="text-blue-400 font-medium">#{selectedTag}</span></span>}
          {searchQuery && <span className="ml-1">matching "<span className="text-blue-400 font-medium">{searchQuery}</span>"</span>}
        </div>
      </div>

      {/* Posts Grid/List */}
      {filteredPosts.length > 0 ? (
        displayMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <div key={post.slug} className="bg-[#1a2233] border border-gray-800 rounded-lg overflow-hidden hover:border-blue-800/30 transition-all duration-300 shadow-md">
                <a href={`/blog/post/${post.slug}`} className="flex flex-col sm:flex-row p-5 group">
                  <div className="flex-grow">
                    <div className="flex gap-2 flex-wrap mb-2">
                      {post.tags && post.tags.map((tag) => (
                        <span key={tag} className="text-xs px-2 py-0.5 bg-blue-900/30 text-blue-300 rounded-full font-medium">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-lg font-bold mb-2 text-white group-hover:text-blue-400 transition-colors">{post.title}</h3>
                    <p className="text-sm text-gray-300 mb-3 line-clamp-2">{post.description}</p>
                    
                    <div className="flex items-center text-xs text-gray-400">
                      <span>{post.date}</span>
                      <span className="mx-2 w-1 h-1 bg-gray-600 rounded-full"></span>
                      <span>{post.readingTime || '5 min read'}</span>
                    </div>
                  </div>
                  <div className="flex items-center mt-3 sm:mt-0 sm:ml-4">
                    <span className="text-sm text-blue-400 group-hover:text-blue-300 transition-colors flex items-center">
                      Read more
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1 group-hover:translate-x-1 transition-transform duration-200">
                        <path d="M5 12h14"></path>
                        <path d="m12 5 7 7-7 7"></path>
                      </svg>
                    </span>
                  </div>
                </a>
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="text-center py-16 bg-gradient-to-b from-[#1a2233] to-[#161b22] rounded-lg border border-gray-800">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-xl font-medium text-gray-300 mb-2">No posts found</h3>
          <p className="text-gray-400 max-w-md mx-auto mb-6">
            Try adjusting your search or filter to find what you're looking for.
          </p>
          <button 
            onClick={() => { setSelectedTag(null); setSearchQuery(""); }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
