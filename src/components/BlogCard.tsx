import { Post } from "@/types/types";
import Link from "next/link";

export default function BlogCard({ post }: { post: Post }) {
  return (
    <Link href={`/blog/${post.slug}`} className="block group">
      <div className="p-6 bg-[#161b22] rounded-lg shadow-md hover:shadow-xl transition-all">
        <h2 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
          {post.title}
        </h2>
        <p className="text-sm text-gray-400 mb-4">{post.description}</p>
        <p className="text-xs text-gray-500">{post.date}</p>
      </div>
    </Link>
  );
}
