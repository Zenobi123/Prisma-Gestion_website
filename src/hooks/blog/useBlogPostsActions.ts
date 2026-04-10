
import { useToast } from "@/hooks/use-toast";
import { BlogPost, NewBlogPost } from "@/types/blog";
import { 
  addBlogPost, 
  updateBlogPost, 
  deleteBlogPost, 
  publishBlogPost 
} from "@/services/blog";

export const useBlogPostsActions = (
  isMounted: { current: boolean },
  loadPosts: () => Promise<void>
) => {
  const { toast } = useToast();

  const handleAddPost = async (newPost: NewBlogPost) => {
    try {
      await addBlogPost(newPost);
      
      if (isMounted.current) {
        toast({
          title: "Article créé",
          description: `L'article "${newPost.title}" a été créé avec succès.`,
        });
      }
      
      await loadPosts();
      return true;
    } catch (error) {
      console.error('Erreur lors de la création de l\'article:', error);
      if (isMounted.current) {
        toast({
          title: "Erreur",
          description: "Impossible de créer l'article.",
          variant: "destructive",
        });
      }
      return false;
    }
  };

  const handleEditPost = async (editedPost: BlogPost) => {
    try {
      await updateBlogPost(editedPost);
      
      if (isMounted.current) {
        toast({
          title: "Article modifié",
          description: `L'article "${editedPost.title}" a été modifié avec succès.`,
        });
      }
      
      await loadPosts();
      return true;
    } catch (error) {
      console.error('Erreur lors de la modification de l\'article:', error);
      if (isMounted.current) {
        toast({
          title: "Erreur",
          description: "Impossible de modifier l'article.",
          variant: "destructive",
        });
      }
      return false;
    }
  };

  const handleDeletePost = async (postId: number, postTitle: string) => {
    try {
      await deleteBlogPost(postId);
      
      if (isMounted.current) {
        toast({
          title: "Article supprimé",
          description: `L'article "${postTitle}" a été supprimé avec succès.`,
        });
      }
      
      await loadPosts();
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'article:', error);
      if (isMounted.current) {
        toast({
          title: "Erreur",
          description: "Impossible de supprimer l'article.",
          variant: "destructive",
        });
      }
      return false;
    }
  };

  const handlePublishPost = async (post: BlogPost) => {
    try {
      console.log("Publication de l'article:", post.title);
      await publishBlogPost(post.id);
      
      if (isMounted.current) {
        toast({
          title: "Article publié",
          description: `L'article "${post.title}" a été publié avec succès.`,
        });
      }
      
      window.dispatchEvent(new CustomEvent('blogPostsUpdated'));
      await loadPosts();
      return true;
    } catch (error) {
      console.error('Erreur lors de la publication de l\'article:', error);
      if (isMounted.current) {
        toast({
          title: "Erreur",
          description: "Impossible de publier l'article.",
          variant: "destructive",
        });
      }
      return false;
    }
  };

  return {
    handleAddPost,
    handleEditPost,
    handleDeletePost,
    handlePublishPost
  };
};

