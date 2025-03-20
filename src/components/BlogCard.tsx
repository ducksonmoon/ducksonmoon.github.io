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
  } catch (error) {
    // Keep original date string if formatting fails
  }

  return (
    <Link href={`/blog/post/${post.slug}`} className="block group h-full">
      <div className="h-full p-4 sm:p-6 bg-[#161b22] rounded-lg border border-gray-800 shadow-md hover:shadow-xl hover:border-gray-700 transition-all duration-300 flex flex-col">
        <div className="flex-grow">
          <div className="flex gap-1.5 sm:gap-2 flex-wrap mb-2 sm:mb-3">
            {post.tags && post.tags.map((tag) => (
              <span key={tag} className="text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 bg-gray-800 text-blue-400 rounded-full">
                #{tag}
              </span>
            ))}
          </div>
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3 text-white group-hover:text-blue-400 transition-colors duration-300">
            {post.title}
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 mb-3 sm:mb-4 line-clamp-2 sm:line-clamp-3">{post.description}</p>
        </div>
        <div className="flex items-center text-xs text-gray-500 mt-2">
          <span className="mr-2 text-[10px] sm:text-xs">{formattedDate}</span>
          <span className="inline-block w-1 h-1 rounded-full bg-gray-500"></span>
          <span className="ml-2 text-[10px] sm:text-xs">{post.readingTime || '5 min read'}</span>
        </div>
      </div>
    </Link>
  );
}
