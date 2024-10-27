import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface Post {
  slug: string;
  title: string;
  date: string;
  description: string;
  content?: string;
}

export async function getPosts(): Promise<Post[]> {
  const postsDirectory = path.join(process.cwd(), "src/posts");
  const filenames = fs.readdirSync(postsDirectory);

  return filenames.map((filename) => {
    const filePath = path.join(postsDirectory, filename);
    const fileContents = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(fileContents);

    return {
      slug: filename.replace(".md", ""),
      ...data,
    } as Post;
  });
}

export async function getPostBySlug(slug: string): Promise<Post> {
  const postsDirectory = path.join(process.cwd(), "src/posts");
  const filePath = path.join(postsDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContents);

  return {
    slug,
    ...data,
    content,
  } as Post;
}
