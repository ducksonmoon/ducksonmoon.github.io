"use client";

import { useState } from "react";
import BlogCard from "@/components/BlogCard";
import { Post } from "@/types/types";

export default function BlogList({ posts }: { posts: Post[] }) {
  const allTags = Array.from(new Set(posts.flatMap((post) => post.tags)));
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const filteredPosts = selectedTag
    ? posts.filter((post) => post.tags.includes(selectedTag))
    : posts;

  return (
    <div>
      <div className="flex space-x-4 mb-8">
        <button
          onClick={() => setSelectedTag(null)}
          className={`px-3 py-1 rounded ${
            !selectedTag ? "bg-primary text-white" : "bg-gray-700"
          }`}
        >
          All
        </button>
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className={`px-3 py-1 rounded ${
              selectedTag === tag ? "bg-primary text-white" : "bg-gray-700"
            }`}
          >
            #{tag}
          </button>
        ))}
      </div>

      <div className="space-y-8">
        {filteredPosts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
