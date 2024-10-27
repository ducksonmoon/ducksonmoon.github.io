import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import { format } from "date-fns";
import { getPostBySlug } from "@/lib/getPosts";
import { CodeBlock } from "@/lib/CodeBlock";

interface BlogPostProps {
  params: { slug: string };
}

export default async function BlogPostPage({
  params: { slug },
}: BlogPostProps) {
  const post = await getPostBySlug(slug);
  const formattedDate = format(new Date(post.date), "MMMM dd, yyyy");

  return (
    <div className="min-h-screen bg-[#0d1117] text-white px-6 md:px-16 py-12">
      <div className="max-w-6xl mx-auto">
        <Link
          href="/blog"
          className="text-primary hover:underline text-lg mb-8 block"
        >
          ← Back to Blog
        </Link>
        <article>
          <h1 className="text-5xl font-extrabold mb-6">{post.title}</h1>
          <p className="text-sm text-gray-400 mb-12">{formattedDate}</p>
          <ReactMarkdown
            // @ts-expect-error
            components={{ code: CodeBlock }}
            remarkPlugins={[remarkGfm]}
          >
            {post.content}
          </ReactMarkdown>
        </article>
      </div>
    </div>
  );
}