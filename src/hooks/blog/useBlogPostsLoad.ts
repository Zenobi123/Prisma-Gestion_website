
import { useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { getBlogPosts } from "@/services/blog";

export const useBlogPostsLoad = (
  setIsLoading: (loading: boolean) => void,
  setPosts: (posts: any[]) => void,
  isMounted: { current: boolean }
) => {
  const { toast } = useToast();

  return useCallback(async () => {
    if (!isMounted.current) return;
    
    try {
      setIsLoading(true);
      console.log("Chargement des articles en cours...");
      const loadedPosts = await getBlogPosts();
      
      if (!isMounted.current) return;
      
      console.log("Posts chargés:", loadedPosts);
      setPosts(loadedPosts);
    } catch (error) {
      console.error('Erreur lors du chargement des articles:', error);
      if (isMounted.current) {
        toast({
          title: "Erreur",
          description: "Impossible de charger les articles.",
          variant: "destructive",
        });
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  }, [toast, setIsLoading, setPosts, isMounted]);
};
