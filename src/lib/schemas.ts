import { z } from "zod";

// Base schemas
export const PostSchema = z.object({
  id: z.number(),
  title: z
    .string()
    .min(3, "Title is required")
    .max(200, "Title must be less than 200 characters"),
  body: z
    .string()
    .min(10, "Body must be at least 10 characters")
    .max(2000, "Body must be less than 2000 characters"),
  author: z
    .string()
    .min(4, "Author is required")
    .max(30, "Author name must be less than 30 characters"),
  createdAt: z
    .string()
    .datetime()
    .or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/))
});

export const UserSchema = z.object({
  id: z.number(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  username: z.string().optional(),
  phone: z.string().optional(),
  website: z.string().url().optional().or(z.literal(""))
});

// Create/Update schemas (without id and createdAt)
export const CreatePostSchema = PostSchema.omit({ id: true, createdAt: true });
export const UpdatePostSchema = CreatePostSchema.partial();

// API Response schemas
export const PostsResponseSchema = z.array(PostSchema);
export const PostResponseSchema = PostSchema;
export const UserResponseSchema = UserSchema;

// Error response schema
export const ErrorResponseSchema = z.object({
  error: z.string(),
  details: z.unknown().optional()
});

// API Request schemas
export const CreatePostRequestSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters"),
  body: z
    .string()
    .min(1, "Body is required")
    .max(2000, "Body must be less than 2000 characters"),
  author: z
    .string()
    .min(1, "Author is required")
    .max(100, "Author name must be less than 100 characters")
});

// Type exports (inferred from schemas)
export type Post = z.infer<typeof PostSchema>;
export type User = z.infer<typeof UserSchema>;
export type CreatePostData = z.infer<typeof CreatePostSchema>;
export type UpdatePostData = z.infer<typeof UpdatePostSchema>;
export type CreatePostRequest = z.infer<typeof CreatePostRequestSchema>;
export type PostsResponse = z.infer<typeof PostsResponseSchema>;
export type PostResponse = z.infer<typeof PostResponseSchema>;
export type UserResponse = z.infer<typeof UserResponseSchema>;
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;

// Validation helpers
export const validatePost = (data: unknown): Post => {
  return PostSchema.parse(data);
};

export const validateCreatePostData = (data: unknown): CreatePostData => {
  return CreatePostSchema.parse(data);
};

export const validateUser = (data: unknown): User => {
  return UserSchema.parse(data);
};

// Safe parsing (returns success/error instead of throwing)
export const safeParsePost = (data: unknown) => {
  return PostSchema.safeParse(data);
};

export const safeParseCreatePostData = (data: unknown) => {
  return CreatePostSchema.safeParse(data);
};

export const safeParseUser = (data: unknown) => {
  return UserSchema.safeParse(data);
};
