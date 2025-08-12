"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  type Post,
  type CreatePostData,
  safeParseCreatePostData,
  type ErrorResponse
} from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  RefreshCw,
  Plus,
  CheckCircle,
  AlertCircle,
  FileText,
  User
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

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

interface ValidationErrors {
  title?: string;
  body?: string;
  author?: string;
}

export default function ZodSamplePage() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<CreatePostData>({
    title: "",
    body: "",
    author: ""
  });
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );
  const [fieldTouched, setFieldTouched] = useState<Record<string, boolean>>({});

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

      // Reset form and validation
      setFormData({ title: "", body: "", author: "" });
      setValidationErrors({});
      setFieldTouched({});

      console.log("Post created successfully:", newPost);
    },
    onError: (error) => {
      console.error("Failed to create post:", error);
    }
  });

  // Real-time validation
  const validateField = (name: keyof CreatePostData, value: string) => {
    const testData = { ...formData, [name]: value };
    const validationResult = safeParseCreatePostData(testData);

    if (!validationResult.success) {
      const fieldError = validationResult.error.issues.find((issue) =>
        issue.path.includes(name)
      );
      return fieldError?.message;
    }

    return undefined;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear validation error when user starts typing
    if (validationErrors[name as keyof ValidationErrors]) {
      setValidationErrors((prev) => ({ ...prev, [name]: undefined }));
    }

    // Real-time validation for touched fields
    if (fieldTouched[name]) {
      const error = validateField(name as keyof CreatePostData, value);
      setValidationErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (name: keyof CreatePostData) => {
    setFieldTouched((prev) => ({ ...prev, [name]: true }));

    const error = validateField(name, formData[name]);
    setValidationErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    setFieldTouched({ title: true, body: true, author: true });

    // Validate all fields
    const validationResult = safeParseCreatePostData(formData);

    if (!validationResult.success) {
      const errors: ValidationErrors = {};
      validationResult.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof ValidationErrors;
        errors[field] = issue.message;
      });
      setValidationErrors(errors);
      return;
    }

    // Clear all validation errors
    setValidationErrors({});

    createPostMutation.mutate(validationResult.data);
  };

  const getFieldError = (name: keyof ValidationErrors) => {
    return validationErrors[name];
  };

  const isFieldValid = (name: keyof ValidationErrors) => {
    return !validationErrors[name] && fieldTouched[name];
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
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur("title")}
                    required
                    className={
                      getFieldError("title")
                        ? "border-destructive focus:ring-destructive"
                        : isFieldValid("title")
                        ? "border-green-500 focus:ring-green-500"
                        : ""
                    }
                    placeholder="Enter post title (3-200 characters)"
                  />
                  {getFieldError("title") && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {getFieldError("title")}
                    </p>
                  )}
                  {isFieldValid("title") && (
                    <p className="text-sm text-green-600 flex items-center gap-1">
                      <CheckCircle className="h-4 w-4" />
                      Valid
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="author">Author *</Label>
                  <Input
                    id="author"
                    name="author"
                    value={formData.author}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur("author")}
                    required
                    className={
                      getFieldError("author")
                        ? "border-destructive focus:ring-destructive"
                        : isFieldValid("author")
                        ? "border-green-500 focus:ring-green-500"
                        : ""
                    }
                    placeholder="Enter author name (4-30 characters)"
                  />
                  {getFieldError("author") && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {getFieldError("author")}
                    </p>
                  )}
                  {isFieldValid("author") && (
                    <p className="text-sm text-green-600 flex items-center gap-1">
                      <CheckCircle className="h-4 w-4" />
                      Valid
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="body">Content *</Label>
                  <Textarea
                    id="body"
                    name="body"
                    value={formData.body}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur("body")}
                    required
                    rows={4}
                    className={
                      getFieldError("body")
                        ? "border-destructive focus:ring-destructive"
                        : isFieldValid("body")
                        ? "border-green-500 focus:ring-green-500"
                        : ""
                    }
                    placeholder="Enter post content (10-2000 characters)"
                  />
                  {getFieldError("body") && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {getFieldError("body")}
                    </p>
                  )}
                  {isFieldValid("body") && (
                    <p className="text-sm text-green-600 flex items-center gap-1">
                      <CheckCircle className="h-4 w-4" />
                      Valid
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {formData.body.length}/2000 characters
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={createPostMutation.isPending}
                  className="w-full"
                >
                  {createPostMutation.isPending ? (
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

              {createPostMutation.isError && (
                <Alert variant="destructive" className="mt-4">
                  <AlertDescription>
                    Error: {createPostMutation.error?.message}
                  </AlertDescription>
                </Alert>
              )}

              {createPostMutation.isSuccess && (
                <Alert className="mt-4 border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    Post created successfully!
                  </AlertDescription>
                </Alert>
              )}
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
              <div className="space-y-4">
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
