import { getPostBySlug } from "@/lib/getPosts";
import { generateStaticParams } from "./generateParams";
import BlogPost from "./BlogPost";
import { tParams } from "@/types/types";

export { generateStaticParams };


export default async function BlogPostPage(props: { params: tParams }) {
  const { slug } = await props.params;

  const post = await getPostBySlug(slug);
  
  return <BlogPost post={post} />;
}
