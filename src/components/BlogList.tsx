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
      <div className="mb-8 bg-[#1a1f27] rounded-xl p-5 sm:p-6 border border-gray-800 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between sm:mb-6">
          <h2 className="text-xl font-bold text-white mb-4 sm:mb-0">Browse Articles</h2>
          
          {/* View Mode Selector */}
          <div className="flex items-center space-x-2 mb-4 sm:mb-0">
            <button
              onClick={() => setDisplayMode("grid")}
              className={`p-2 rounded-md transition-all duration-200 ${
                displayMode === "grid"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/20 scale-105"
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
              className={`p-2 rounded-md transition-all duration-200 ${
                displayMode === "list"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/20 scale-105"
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
          <h3 className="text-sm text-gray-400 mb-3 font-medium flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            Filter by tag:
          </h3>
          <div className="flex flex-wrap gap-2 max-h-[140px] overflow-y-auto pr-1 pb-1 custom-scrollbar">
            <button
              onClick={() => setSelectedTag(null)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                !selectedTag 
                  ? "bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-600/20 scale-105" 
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              All Posts
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 flex items-center ${
                  selectedTag === tag 
                    ? "bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-600/20 scale-105" 
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                <span className="mr-0.5">#</span>{tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Post Count */}
      <div className="mb-6 pb-4 border-b border-gray-800 text-gray-400 text-sm flex flex-wrap items-center justify-between">
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <span className="font-medium text-white">{filteredPosts.length}</span> 
          <span className="ml-1">{filteredPosts.length === 1 ? 'post' : 'posts'}</span>
          {selectedTag && (
            <div className="flex items-center ml-2">
              <span>tagged with</span>
              <span className="ml-1 px-2 py-0.5 bg-blue-900/30 text-blue-300 rounded-full text-xs font-medium flex items-center">
                <span className="mr-0.5">#</span>{selectedTag}
              </span>
            </div>
          )}
          {searchQuery && (
            <div className="flex items-center ml-2">
              <span>matching</span>
              <span className="ml-1 px-2 py-0.5 bg-blue-900/30 text-blue-300 rounded-full text-xs font-medium">
                "{searchQuery}"
              </span>
            </div>
          )}
        </div>
        
        {(selectedTag || searchQuery) && (
          <button 
            onClick={() => { setSelectedTag(null); setSearchQuery(""); }}
            className="mt-2 sm:mt-0 text-sm text-blue-400 hover:text-blue-300 transition-colors flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Clear filters
          </button>
        )}
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
