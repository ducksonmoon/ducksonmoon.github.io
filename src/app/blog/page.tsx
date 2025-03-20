import BlogList from "@/components/BlogList";
import { getPosts } from "@/lib/getPosts";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | Mehrshad Baqerzadegan",
  description: "Thoughts, ideas, and tutorials on web development, design, and more by Mehrshad Baqerzadegan",
  openGraph: {
    title: "Blog | Mehrshad Baqerzadegan",
    description: "Thoughts, ideas, and tutorials on web development, design, and more by Mehrshad Baqerzadegan",
    url: "https://ducksonmoon.github.io/blog",
    type: "website",
    images: [
      {
        url: "https://ducksonmoon.github.io/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Mehrshad Baqerzadegan Blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | Mehrshad Baqerzadegan",
    description: "Thoughts, ideas, and tutorials on web development, design, and more by Mehrshad Baqerzadegan",
    images: ["https://ducksonmoon.github.io/og-image.svg"],
  },
};

export default async function BlogListPage() {
  const posts = await getPosts();
  
  // Featured posts (take the 2 most recent posts)
  const featuredPosts = posts.slice(0, 2);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0d1117] to-[#161b22]">
      {/* Hero Section */}
      <div className="w-full bg-[#0d1117] border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-12 md:py-20 lg:py-24">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 md:mb-4">Blog</h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl">
            Thoughts, ideas, and tutorials on web development, design, and more.
          </p>
        </div>
      </div>
      
      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <div className="w-full border-b border-gray-800 py-8 sm:py-10 md:py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Featured Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {featuredPosts.map((post) => (
                <Link 
                  href={`/blog/post/${post.slug}`} 
                  key={post.slug}
                  className="group block h-full"
                >
                  <div className="h-full p-4 sm:p-6 bg-gradient-to-br from-blue-900/40 to-gray-900 rounded-lg border border-blue-800/50 shadow-md hover:shadow-blue-900/10 hover:border-blue-700/70 transition-all duration-300">
                    <div className="flex gap-2 flex-wrap mb-2 md:mb-3">
                      {post.tags && post.tags.map((tag) => (
                        <span key={tag} className="text-xs px-2 py-1 bg-blue-900/50 text-blue-300 rounded-full">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 md:mb-3 text-white group-hover:text-blue-300 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-300 mb-3 md:mb-4 line-clamp-2">{post.description}</p>
                    <div className="flex justify-between items-center mt-2 md:mt-4">
                      <span className="text-xs text-gray-400">{post.date}</span>
                      <span className="text-xs sm:text-sm text-blue-400 group-hover:text-blue-300 transition-colors">Read more →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Content Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-10 md:py-12">
        <BlogList posts={posts} />
      </div>
    </div>
  );
}
