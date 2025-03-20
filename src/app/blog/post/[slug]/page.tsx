import { getPostBySlug } from "@/lib/getPosts";
import { generateStaticParams } from "./generateParams";
import BlogPost from "./BlogPost";

export { generateStaticParams };

interface PageParams {
  params: Promise<{ slug: string }> | { slug: string };
}

export default async function BlogPostPage({ params }: PageParams) {
  // Ensure params is awaited
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  
  const post = await getPostBySlug(slug);
  
  return <BlogPost post={post} />;
}
