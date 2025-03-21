import { getPostBySlug } from "@/lib/getPosts";
import { generateStaticParams } from "./generateParams";
import BlogPost from "./BlogPost";
import { tParams } from "@/types/types";
import { Metadata } from "next";

export { generateStaticParams };

export async function generateMetadata(props: { params: tParams }): Promise<Metadata> {
  const { slug } = await props.params;
  const post = await getPostBySlug(slug);
  
  // Default image if not provided
  const ogImage = post.coverImage || "https://ducksonmoon.github.io/duck.svg";
  
  return {
    title: `${post.title} | Mehrshad Baqerzadegan Blog`,
    description: post.description || post.content?.substring(0, 160) || "Read this blog post on Mehrshad Baqerzadegan's portfolio",
    openGraph: {
      title: post.title,
      description: post.description || post.content?.substring(0, 160) || "Read this blog post on Mehrshad Baqerzadegan's portfolio",
      url: `https://ducksonmoon.github.io/blog/post/${slug}`,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.lastModified || post.date,
      authors: ["Mehrshad Baqerzadegan"],
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      tags: post.tags || [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description || post.content?.substring(0, 160) || "Read this blog post on Mehrshad Baqerzadegan's portfolio",
      images: [ogImage],
    },
    alternates: {
      canonical: `https://ducksonmoon.github.io/blog/post/${slug}`,
    },
  };
}

export default async function BlogPostPage(props: { params: tParams }) {
  const { slug } = await props.params;

  const post = await getPostBySlug(slug);
  
  return <BlogPost post={post} />;
}
