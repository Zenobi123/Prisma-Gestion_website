
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import BlogPostsTable from "./blog/BlogPostsTable";
import BlogPanelHeader from "./blog/BlogPanelHeader";
import BlogDialogs from "./blog/BlogDialogs";
import { useBlogPosts } from "@/hooks/useBlogPosts";
import { useDialogStates } from "@/hooks/blog/useDialogStates";
import SpecialArticleNotice from "./blog/SpecialArticleNotice";
import { BlogPost } from "@/types/blog";

const BlogPanel = () => {
  const [newPost, setNewPost] = useState({
    title: "",
    excerpt: "",
    content: "",
    author: "Nathan OBIANG TIME",
    publishDate: new Date().toISOString().split("T")[0],
    status: "Brouillon" as const,
    image: "/placeholder.svg",
    slug: "",
    tags: [] as string[],
    seoTitle: "",
    seoDescription: ""
  });
  
  const { 
    posts, 
    isLoading, 
    handleAddPost, 
    handleEditPost, 
    handleDeletePost, 
    handlePublishPost,
    loadPosts
  } = useBlogPosts();
  
  const {
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
  } = useDialogStates();

  const { toast } = useToast();

  const onAddPost = async () => {
    const success = await handleAddPost(newPost);
    if (success) {
      setIsAddDialogOpen(false);
      setNewPost({
        title: "",
        excerpt: "",
        content: "",
        author: "Nathan OBIANG TIME",
        publishDate: new Date().toISOString().split("T")[0],
        status: "Brouillon",
        image: "/placeholder.svg",
        slug: "",
        tags: [],
        seoTitle: "",
        seoDescription: ""
      });
      toast({
        title: "Article créé",
        description: "L'article a été créé avec succès."
      });
    }
  };

  const onEditPost = async () => {
    if (!selectedPost) return;
    
    console.log("Enregistrement de l'article en cours:", selectedPost);
    const success = await handleEditPost(selectedPost);
    if (success) {
      toast({
        title: "Article modifié",
        description: "L'article a été modifié avec succès."
      });
    }
    return success;
  };

  const onDeletePost = async () => {
    if (!selectedPost) return;
    
    const success = await handleDeletePost(selectedPost.id, selectedPost.title);
    if (success) {
      setIsDeleteDialogOpen(false);
    }
  };

  const onPublishPost = async (post: BlogPost) => {
    console.log("Demande de publication de l'article:", post.title);
    await handlePublishPost(post);
  };

  const handleSchedulePost = (post: BlogPost) => {
    toast({
      title: "Publication programmée",
      description: `La programmation de publication pour "${post.title}" sera implémentée ultérieurement.`,
    });
  };

  const handleNewPostChange = (post: typeof newPost) => {
    setNewPost(post);
  };

  return (
    <div className="space-y-6">
      <BlogPanelHeader onAddClick={() => setIsAddDialogOpen(true)} />

      <BlogPostsTable 
        posts={posts}
        isLoading={isLoading}
        onEdit={handleOpenEditDialog}
        onDelete={handleOpenDeleteDialog}
        onPublish={onPublishPost}
        onSchedule={handleSchedulePost}
      />

      <BlogDialogs 
        isAddDialogOpen={isAddDialogOpen}
        setIsAddDialogOpen={setIsAddDialogOpen}
        isEditDialogOpen={isEditDialogOpen}
        setIsEditDialogOpen={setIsEditDialogOpen}
        isDeleteDialogOpen={isDeleteDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        newPost={newPost}
        setNewPost={handleNewPostChange}
        selectedPost={selectedPost}
        setSelectedPost={setSelectedPost}
        onAddPost={onAddPost}
        onEditPost={onEditPost}
        onDeletePost={onDeletePost}
        loadPosts={loadPosts}
      />
    </div>
  );
};

export default BlogPanel;
