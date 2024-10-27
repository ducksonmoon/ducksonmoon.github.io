import { getPosts } from "@/lib/getPosts";
import Link from "next/link";

export default async function BlogListPage() {
  const posts = await getPosts();

  return (
    <div className="min-h-screen bg-[#0d1117] text-white px-6 md:px-16 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold mb-12">Blog</h1>
        <div className="space-y-6">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <div className="p-6 bg-[#161b22] rounded-lg hover:bg-[#1e1e2e] transition duration-300">
                <h2 className="text-3xl font-semibold">{post.title}</h2>
                <p className="text-gray-400 mt-2">{post.date}</p>
                <p className="text-gray-300 mt-4">{post.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
