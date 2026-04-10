
import React from "react";
import { BlogPost, NewBlogPost } from "@/types/blog";
import AddPostDialog from "./AddPostDialog";
import EditPostDialog from "./EditPostDialog";
import DeletePostDialog from "./DeletePostDialog";

interface BlogDialogsProps {
  isAddDialogOpen: boolean;
  setIsAddDialogOpen: (open: boolean) => void;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (open: boolean) => void;
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (open: boolean) => void;
  newPost: NewBlogPost;
  setNewPost: (post: NewBlogPost) => void;
  selectedPost: BlogPost | null;
  setSelectedPost: (post: BlogPost | null) => void;
  onAddPost: () => void;
  onEditPost: () => void;
  onDeletePost: () => void;
  loadPosts: () => Promise<void>;
}

const BlogDialogs: React.FC<BlogDialogsProps> = ({
  isAddDialogOpen,
  setIsAddDialogOpen,
  isEditDialogOpen,
  setIsEditDialogOpen,
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  newPost,
  setNewPost,
  selectedPost,
  setSelectedPost,
  onAddPost,
  onEditPost,
  onDeletePost,
  loadPosts
}) => {
  return (
    <>
      <AddPostDialog 
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        post={newPost}
        onPostChange={setNewPost}
        onAddPost={onAddPost}
      />

      <EditPostDialog 
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        post={selectedPost}
        onPostChange={setSelectedPost}
        onEditPost={onEditPost}
        loadPosts={loadPosts}
      />

      <DeletePostDialog 
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        post={selectedPost}
        onDeletePost={onDeletePost}
      />
    </>
  );
};

export default BlogDialogs;
