
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
import { NewBlogPost } from "@/types/blog";
import BlogPostForm from "./BlogPostForm";
import { useToast } from "@/hooks/use-toast";
import SubmitButton from "@/components/SubmitButton";
import { generateFormattedContent } from "@/services/blog/formatBlogContent";

interface AddPostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post: NewBlogPost;
  onPostChange: (post: NewBlogPost) => void;
  onAddPost: () => void;
}

const AddPostDialog = ({
  open,
  onOpenChange,
  post,
  onPostChange,
  onAddPost,
}: AddPostDialogProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isUpdatingContent, setIsUpdatingContent] = useState(false);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      // S'assurer que le contenu est correctement formaté avant l'enregistrement
      if (post.content && !post.content.includes('<')) {
        const formattedContent = generateFormattedContent({...post} as any);
        onPostChange({
          ...post,
          content: formattedContent,
        });
      }
      
      await onAddPost();
      setSubmitSuccess(true);
      
      setTimeout(() => {
        setSubmitSuccess(false);
        onOpenChange(false);
      }, 1200);
    } catch (error) {
      console.error("Error adding post:", error);
      toast({
        title: "Erreur lors de la création",
        description: "Une erreur est survenue lors de la création de l'article.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateContent = async () => {
    if (!post) return;
    
    setIsUpdatingContent(true);
    try {
      // Générer le contenu formaté
      const formattedContent = generateFormattedContent(post as any);
      
      // Mettre à jour l'article avec le contenu formaté
      onPostChange({
        ...post,
        content: formattedContent,
      });
      
      toast({
        title: "Contenu mis à jour",
        description: "Le contenu a été formaté avec succès."
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour du contenu:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le contenu formaté.",
        variant: "destructive"
      });
    } finally {
      setIsUpdatingContent(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isSubmitting) {
        onOpenChange(isOpen);
        if (!isOpen) {
          setSubmitSuccess(false);
        }
      }
    }}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ajouter un article</DialogTitle>
          <DialogDescription>
            Créez un nouvel article pour votre blog.
          </DialogDescription>
        </DialogHeader>

        <BlogPostForm 
          post={post}
          isNewPost={true}
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
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <SubmitButton
              isSubmitting={isSubmitting}
              submitSuccess={submitSuccess}
              text="Enregistrer"
              loadingText="Enregistrement en cours..."
              successText="Article créé !"
              onClick={handleSubmit}
            />
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddPostDialog;
