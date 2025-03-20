export async function generateStaticParams() {
  const fs = (await import("fs")).promises;
  const path = (await import("path")).default;

  const postsDirectory = path.join(process.cwd(), "src/posts");
  const filenames = await fs.readdir(postsDirectory);

  return filenames.map((filename) => ({
    slug: filename.replace(".md", ""),
  }));
} 