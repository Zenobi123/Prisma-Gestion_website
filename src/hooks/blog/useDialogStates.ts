
import { useState } from "react";
import { BlogPost } from "@/types/blog";

export const useDialogStates = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  const handleOpenEditDialog = (post: BlogPost) => {
    setSelectedPost({...post});
    setIsEditDialogOpen(true);
  };

  const handleOpenDeleteDialog = (post: BlogPost) => {
    setSelectedPost(post);
    setIsDeleteDialogOpen(true);
  };

  return {
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    selectedPost,
    setSelectedPost,
    handleOpenEditDialog,
    handleOpenDeleteDialog
  };
};
