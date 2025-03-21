import { Post } from "@/types/types";
import Link from "next/link";
import { format } from "date-fns";

export default function BlogCard({ post }: { post: Post }) {
  // Format the date if it's a valid date string
  let formattedDate = post.date;
  try {
    if (post.date) {
      const dateObj = new Date(post.date);
      if (!isNaN(dateObj.getTime())) {
        formattedDate = format(dateObj, 'MMMM d, yyyy');
      }
    }
  } catch {
    // Fallback to original date if parsing fails
  }

  return (
    <Link href={`/blog/post/${post.slug}`} className="block group h-full">
      <article className="h-full p-6 bg-gradient-to-b from-[#1a2233] to-[#161b22] rounded-lg border border-gray-800 shadow-lg hover:shadow-xl hover:border-blue-800/30 transition-all duration-300 flex flex-col relative overflow-hidden">
        {/* Hover effect overlay */}
        <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Card content */}
        <div className="flex-grow relative z-10">
          {/* Tags */}
          <div className="flex gap-2 flex-wrap mb-3">
            {post.tags && post.tags.map((tag) => (
              <span 
                key={tag} 
                className="text-xs px-2.5 py-1 bg-blue-900/30 text-blue-300 rounded-full font-medium transition-colors group-hover:bg-blue-900/40"
              >
                #{tag}
              </span>
            ))}
          </div>
          
          {/* Title with gradient hover effect */}
          <h2 className="text-xl font-bold mb-3 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-blue-300 transition-all duration-300">
            {post.title}
          </h2>
          
          {/* Description with slightly improved readability */}
          <p className="text-sm text-gray-300 mb-4 line-clamp-3 leading-relaxed">
            {post.description}
          </p>
        </div>
        
        {/* Footer with metadata */}
        <div className="flex items-center justify-between text-xs pt-3 border-t border-gray-800/50 mt-2 text-gray-400">
          <div className="flex items-center space-x-2">
            <span>{formattedDate}</span>
            <span className="inline-block w-1 h-1 rounded-full bg-gray-500"></span>
            <span>{post.readingTime || '5 min read'}</span>
          </div>
          
          <span className="text-blue-400 group-hover:text-blue-300 transition-colors flex items-center">
            Read
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1 group-hover:translate-x-1 transition-transform duration-200">
              <path d="M5 12h14"></path>
              <path d="m12 5 7 7-7 7"></path>
            </svg>
          </span>
        </div>
      </article>
    </Link>
  );
}
