export interface Post {
  slug: string;
  title: string;
  date: string;
  description: string;
  content?: string;
  tags: string[];
  readingTime?: string;
  coverImage?: string;
  lastModified?: string;
}

export type tParams = Promise<{ slug: string }>;
