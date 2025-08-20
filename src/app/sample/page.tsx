"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type CreatePostData, CreatePostSchema } from "@/lib/schemas";
import { usePosts } from "@/lib/hooks/use-posts";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import {
  RefreshCw,
  Plus,
  CheckCircle,
  AlertCircle,
  FileText,
  User
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function ZodSamplePage() {
  // React Hook Form with Zod validation
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    reset,
    watch
  } = useForm<CreatePostData>({
    resolver: zodResolver(CreatePostSchema),
    mode: "onBlur" // Validate on blur for better UX
  });

  const bodyLength = watch("body")?.length || 0;

  // Custom hook for posts operations
  const {
    posts,
    postsLoading,
    postsError,
    refetchPosts,
    createPost,
    isCreating,
    createError,
    isCreateSuccess,
    resetCreateMutation
  } = usePosts();

  // Show toast notifications for post creation
  useEffect(() => {
    if (isCreateSuccess) {
      toast.success("Post created successfully!", {
        description: "Your post has been added to the list."
      });
      resetCreateMutation();
    }
  }, [isCreateSuccess, resetCreateMutation]);

  useEffect(() => {
    if (createError) {
      toast.error("Failed to create post", {
        description: createError.message
      });
      resetCreateMutation();
    }
  }, [createError, resetCreateMutation]);

  const onSubmit = (data: CreatePostData) => {
    createPost(data);
    reset();
  };

  if (postsLoading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-8">
            React Query Demo Enhanced
          </h1>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading posts...</p>
          </div>
        </div>
      </div>
    );
  }

  if (postsError) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-8">
            React Query Demo Enhanced
          </h1>
          <Alert variant="destructive">
            <AlertDescription>
              Error loading posts: {postsError.message}
            </AlertDescription>
            <Button
              onClick={() => refetchPosts()}
              variant="destructive"
              size="sm"
              className="mt-2"
            >
              Retry
            </Button>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            React Query Demo Enhanced
          </h1>
          <ThemeToggle />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Create Post Form with Zod Validation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Create New Post (with Zod Validation)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    {...register("title")}
                    className={
                      errors.title
                        ? "border-destructive focus:ring-destructive"
                        : ""
                    }
                    placeholder="Enter post title (3-200 characters)"
                  />
                  {errors.title && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.title.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="author">Author *</Label>
                  <Input
                    id="author"
                    {...register("author")}
                    className={
                      errors.author
                        ? "border-destructive focus:ring-destructive"
                        : ""
                    }
                    placeholder="Enter author name (4-30 characters)"
                  />
                  {errors.author && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.author.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="body">Content *</Label>
                  <Textarea
                    id="body"
                    {...register("body")}
                    rows={4}
                    className={
                      errors.body
                        ? "border-destructive focus:ring-destructive"
                        : ""
                    }
                    placeholder="Enter post content (10-2000 characters)"
                  />
                  {errors.body && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.body.message}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {bodyLength}/2000 characters
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={isCreating || !isValid}
                  className="w-full"
                >
                  {isCreating ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Create Post
                    </span>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Posts List */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Posts
                </CardTitle>
                <Button
                  onClick={() => refetchPosts()}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Refresh
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 h-[500px] overflow-y-auto">
                {posts?.map((post) => (
                  <Card
                    key={post.id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-medium text-foreground">
                          {post.title}
                        </h3>
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                          {post.createdAt}
                        </span>
                      </div>
                      <p className="text-muted-foreground mb-3">{post.body}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <User className="h-4 w-4" />
                        By: <span className="font-medium">{post.author}</span>
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {posts?.length === 0 && (
                <p className="text-muted-foreground text-center py-8">
                  No posts yet. Create your first post!
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Zod Features Showcase */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Zod Features Demonstrated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div>
                <h4 className="font-medium mb-2 text-foreground">
                  ✅ Type Safety
                </h4>
                <ul className="space-y-1">
                  <li>• Shared types between frontend and backend</li>
                  <li>• Automatic TypeScript inference</li>
                  <li>• Compile-time type checking</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2 text-foreground">
                  ✅ Runtime Validation
                </h4>
                <ul className="space-y-1">
                  <li>• Real-time form validation</li>
                  <li>• Server-side request validation</li>
                  <li>• Detailed error messages</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2 text-foreground">
                  ✅ Schema Composition
                </h4>
                <ul className="space-y-1">
                  <li>• Base schemas with derived types</li>
                  <li>• Partial and omit transformations</li>
                  <li>• Reusable validation logic</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2 text-foreground">
                  ✅ Error Handling
                </h4>
                <ul className="space-y-1">
                  <li>• Safe parsing with error details</li>
                  <li>• Field-level validation errors</li>
                  <li>• User-friendly error messages</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
