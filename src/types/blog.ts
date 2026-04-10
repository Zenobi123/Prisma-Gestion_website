
export type BlogPostStatus = "Publié" | "Brouillon" | "Programmé";

export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishDate: string;
  status: BlogPostStatus;
  image: string;
  slug: string;
  tags: string[];
  seoTitle: string;
  seoDescription: string;
}

export type NewBlogPost = Omit<BlogPost, "id">;
