import BlogList from "@/components/BlogList";
import { getPosts } from "@/lib/getPosts";
import Link from "next/link";

export default async function BlogListPage() {
  const posts = await getPosts();

  return (
    <div className="min-h-screen bg-[#0d1117] text-white px-6 md:px-16 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold mb-12">Blog</h1>
        <BlogList posts={posts} />
      </div>
    </div>
  );
}
