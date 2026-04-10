
import { useState, useRef } from "react";
import { BlogPost } from "@/types/blog";

export const useBlogPostsState = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isMounted = useRef(true);
  const channelRef = useRef<any>(null);

  return {
    posts,
    setPosts,
    isLoading,
    setIsLoading,
    isMounted,
    channelRef
  };
};
