
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import BlogPostForm from "./BlogPostForm";
import { BlogPost } from "@/types/blog";
import { useToast } from "@/hooks/use-toast";
import SubmitButton from "@/components/SubmitButton";
import { useArticleContent } from "@/hooks/blog/useArticleContent";

interface EditPostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post: BlogPost | null;
  onPostChange: (post: BlogPost) => void;
  onEditPost: () => void;
  loadPosts: () => Promise<void>;
}

const EditPostDialog = ({
  open,
  onOpenChange,
  post,
  onPostChange,
  onEditPost,
  loadPosts
}: EditPostDialogProps) => {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const { 
    isUpdatingContent, 
    handleUpdateArticleContent 
  } = useArticleContent(post ? [post] : [], loadPosts);
  
  if (!post) return null;
  
  const handleSave = async () => {
    try {
      setIsSaving(true);
      // S'assurer que le contenu est correctement formaté avant l'enregistrement
      if (post.content && !post.content.includes('<')) {
        const success = await handleUpdateArticleContent(post);
        if (!success) {
          throw new Error("Échec de la mise à jour du contenu formaté");
        }
      }
      
      await onEditPost();
      setSaveSuccess(true);
      toast({
        title: "Article enregistré",
        description: "Le contenu de l'article a été sauvegardé avec succès.",
      });
      
      setTimeout(() => {
        setSaveSuccess(false);
        onOpenChange(false);
      }, 1200);
    } catch (error) {
      console.error("Error saving post:", error);
      toast({
        title: "Erreur lors de l'enregistrement",
        description: "Une erreur est survenue lors de l'enregistrement de l'article.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateContent = async () => {
    if (post) {
      await handleUpdateArticleContent(post);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isSaving) {
        onOpenChange(isOpen);
        if (!isOpen) {
          setSaveSuccess(false);
        }
      }
    }}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Modifier l'article</DialogTitle>
          <DialogDescription>
            Modifiez le contenu et les paramètres de votre article.
          </DialogDescription>
        </DialogHeader>

        <BlogPostForm 
          post={post}
          onValueChange={onPostChange}
        />
        
        <DialogFooter>
          <div className="flex items-center gap-2 justify-end w-full">
            <Button
              onClick={handleUpdateContent}
              disabled={isUpdatingContent}
              variant="amber"
            >
              {isUpdatingContent ? "Mise à jour..." : "Mettre à jour le contenu formaté"}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isSaving}
            >
              Annuler
            </Button>
            <SubmitButton
              isSubmitting={isSaving}
              submitSuccess={saveSuccess}
              text="Enregistrer"
              loadingText="Enregistrement en cours..."
              successText="Article enregistré !"
              onClick={handleSave}
            />
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditPostDialog;
