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
        url: "https://ducksonmoon.github.io/duck.svg",
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
    images: ["https://ducksonmoon.github.io/duck.svg"],
  },
};

export default async function BlogListPage() {
  const posts = await getPosts();
  
  // Featured posts (take the 2 most recent posts)
  const featuredPosts = posts.slice(0, 2);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0d1117] to-[#131a22]">
      {/* Hero Section */}
      <div className="relative w-full border-b border-gray-800 overflow-hidden">
        {/* Abstract background pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-1/4 w-72 h-72 bg-blue-500 rounded-full filter blur-[120px]"></div>
          <div className="absolute bottom-10 right-1/3 w-80 h-80 bg-indigo-600 rounded-full filter blur-[150px]"></div>
        </div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Blog & Articles
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl leading-relaxed">
              Insights, tutorials, and thoughts on web development, design, and technology. Explore articles crafted to help you grow as a developer.
            </p>
          </div>
        </div>
      </div>
      
      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <div className="w-full border-b border-gray-800 py-12 sm:py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-white">Featured Articles</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {featuredPosts.map((post) => (
                <Link 
                  href={`/blog/post/${post.slug}`} 
                  key={post.slug}
                  className="group block h-full"
                >
                  <article className="h-full p-6 md:p-8 bg-gradient-to-br from-[#1a2233] to-[#16202d] rounded-xl border border-gray-800 shadow-lg hover:shadow-blue-900/10 hover:border-blue-800/30 transition-all duration-300 relative overflow-hidden">
                    {/* Hover effect */}
                    <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <div className="relative z-10">
                      <div className="flex gap-2 flex-wrap mb-4">
                        {post.tags && post.tags.map((tag) => (
                          <span key={tag} className="text-xs px-2.5 py-1 bg-blue-900/30 text-blue-300 rounded-full font-medium">
                            #{tag}
                          </span>
                        ))}
                      </div>
                      
                      <h3 className="text-xl md:text-2xl font-bold mb-3 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-blue-300 transition-all duration-300">
                        {post.title}
                      </h3>
                      
                      <p className="text-sm md:text-base text-gray-300 mb-5 line-clamp-2 leading-relaxed">{post.description}</p>
                      
                      <div className="flex justify-between items-center pt-4 border-t border-gray-800/50 mt-auto">
                        <span className="text-sm text-gray-400">{post.date}</span>
                        <span className="text-sm text-blue-400 group-hover:text-blue-300 transition-colors flex items-center">
                          Read article
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1 group-hover:translate-x-1 transition-transform duration-200">
                            <path d="M5 12h14"></path>
                            <path d="m12 5 7 7-7 7"></path>
                          </svg>
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Content Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <BlogList posts={posts} />
      </div>
    </div>
  );
}
