
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BlogPost } from "@/types/blog";

interface DeletePostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post: BlogPost | null;
  onDeletePost: () => void;
}

const DeletePostDialog = ({
  open,
  onOpenChange,
  post,
  onDeletePost,
}: DeletePostDialogProps) => {
  if (!post) return null;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Supprimer l'article</DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer cet article ? Cette action est irréversible.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-center text-lg font-medium">{post.title}</p>
          <p className="text-center text-sm text-gray-500">
            Publié le {new Date(post.publishDate).toLocaleDateString('fr-FR')} par {post.author}
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button 
            variant="destructive"
            onClick={onDeletePost}
          >
            Supprimer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeletePostDialog;
