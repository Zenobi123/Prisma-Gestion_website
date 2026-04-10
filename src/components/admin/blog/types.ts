
export type BlogPost = {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishDate: string;
  status: "Publié" | "Brouillon" | "Programmé";
  image: string;
  slug: string;
  tags: string[];
  seoTitle: string;
  seoDescription: string;
};

export type NewBlogPost = Omit<BlogPost, "id">;
