
import { useEffect } from "react";
import { useBlogPostsState } from "./blog/useBlogPostsState";
import { useBlogPostsLoad } from "./blog/useBlogPostsLoad";
import { useBlogPostsActions } from "./blog/useBlogPostsActions";
import { useSupabaseChannel } from "./blog/useSupabaseChannel";

export const useBlogPosts = () => {
  const {
    posts,
    setPosts,
    isLoading,
    setIsLoading,
    isMounted,
    channelRef
  } = useBlogPostsState();

  const loadPosts = useBlogPostsLoad(setIsLoading, setPosts, isMounted);

  const {
    handleAddPost,
    handleEditPost,
    handleDeletePost,
    handlePublishPost
  } = useBlogPostsActions(isMounted, loadPosts);

  useSupabaseChannel(isMounted, channelRef, loadPosts);

  useEffect(() => {
    isMounted.current = true;
    console.log("useBlogPosts hook initialisé");
    loadPosts();
    
    return () => {
      isMounted.current = false;
    };
  }, [loadPosts]);

  return {
    posts,
    isLoading,
    handleAddPost,
    handleEditPost,
    handleDeletePost,
    handlePublishPost,
    loadPosts
  };
};
