import { NextResponse } from "next/server";
import { CreatePostSchema } from "@/lib/schemas";
import { getAllPosts, createPost as dbCreatePost } from "@/lib/db/queries";

export async function GET() {
  try {
    const posts = await getAllPosts();
    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate the request body using Zod
    const validationResult = CreatePostSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validationResult.error.issues
        },
        { status: 400 }
      );
    }

    const validatedData = validationResult.data;

    try {
      // Create a new post in the database
      const newPost = await dbCreatePost({
        title: validatedData.title,
        body: validatedData.body,
        author: validatedData.author
      });

      return NextResponse.json(newPost, { status: 201 });
    } catch (error) {
      console.error("Error creating post:", error);
      return NextResponse.json(
        { error: "Failed to create post" },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
}
