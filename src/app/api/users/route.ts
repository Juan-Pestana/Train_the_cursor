import { NextResponse } from "next/server";
import { getAllUsers, createUser as dbCreateUser } from "@/lib/db/queries";
import { UserSchema } from "@/lib/schemas";

export async function GET() {
  try {
    const users = await getAllUsers();
    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate the request body using Zod
    const validationResult = UserSchema.safeParse(body);

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
      // Create a new user in the database
      const newUser = await dbCreateUser({
        name: validatedData.name,
        email: validatedData.email,
        username: validatedData.username,
        phone: validatedData.phone,
        website: validatedData.website
      });

      return NextResponse.json(newUser, { status: 201 });
    } catch (error) {
      console.error("Error creating user:", error);
      return NextResponse.json(
        { error: "Failed to create user" },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
}
