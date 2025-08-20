import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  type Post,
  type CreatePostData,
  type ErrorResponse
} from "@/lib/schemas";

// API functions with proper typing
const fetchPosts = async (): Promise<Post[]> => {
  const response = await fetch("/api/posts");
  if (!response.ok) {
    const errorData: ErrorResponse = await response.json();
    throw new Error(errorData.error || "Failed to fetch posts");
  }
  return response.json();
};

const createPost = async (postData: CreatePostData): Promise<Post> => {
  const response = await fetch("/api/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(postData)
  });

  const data = await response.json();

  if (!response.ok) {
    const errorData = data as ErrorResponse;
    throw new Error(errorData.error || "Failed to create post");
  }

  return data;
};

// Custom hook for posts operations
export function usePosts() {
  const queryClient = useQueryClient();

  // Query for posts
  const {
    data: posts,
    isLoading: postsLoading,
    error: postsError,
    refetch: refetchPosts
  } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts
  });

  // Mutation for creating posts
  const createPostMutation = useMutation({
    mutationFn: createPost,
    onSuccess: (newPost) => {
      // Invalidate and refetch posts
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      console.log("Post created successfully:", newPost);
    },
    onError: (error) => {
      console.error("Failed to create post:", error);
    }
  });

  return {
    // Query state
    posts,
    postsLoading,
    postsError,
    refetchPosts,

    // Mutation state
    createPost: createPostMutation.mutate,
    createPostAsync: createPostMutation.mutateAsync,
    isCreating: createPostMutation.isPending,
    createError: createPostMutation.error,
    isCreateSuccess: createPostMutation.isSuccess,
    resetCreateMutation: createPostMutation.reset
  };
}
