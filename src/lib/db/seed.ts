import { db, users, posts } from "./index";

const seedUsers = [
  {
    name: "John Doe",
    email: "john@example.com",
    username: "johndoe",
    phone: "+1234567890",
    website: "https://johndoe.dev"
  },
  {
    name: "Jane Smith",
    email: "jane@example.com",
    username: "janesmith",
    phone: "+1234567891",
    website: "https://janesmith.dev"
  },
  {
    name: "Mike Johnson",
    email: "mike@example.com",
    username: "mikejohnson",
    phone: "+1234567892",
    website: "https://mikejohnson.dev"
  }
];

const seedPosts = [
  {
    title: "Getting Started with TanStack Query",
    body: "TanStack Query is a powerful library for managing server state in React applications. It provides a great developer experience with automatic caching, background updates, and optimistic updates. In this post, we'll explore how to get started with TanStack Query and build a robust data fetching layer for your React applications.",
    author: "John Doe"
  },
  {
    title: "Advanced React Patterns",
    body: "Learn about advanced React patterns like compound components, render props, and custom hooks. These patterns can help you build more flexible and reusable components. We'll dive deep into each pattern and see real-world examples of how to implement them effectively.",
    author: "Jane Smith"
  },
  {
    title: "Next.js 15 Features",
    body: "Next.js 15 brings exciting new features including improved performance, better developer experience, and enhanced routing capabilities. Let's explore the key features and how they can improve your development workflow and application performance.",
    author: "Mike Johnson"
  },
  {
    title: "TypeScript Best Practices",
    body: "TypeScript has become the standard for building robust React applications. In this comprehensive guide, we'll cover TypeScript best practices, common patterns, and how to write more maintainable and type-safe code.",
    author: "John Doe"
  },
  {
    title: "Building Accessible Components",
    body: "Accessibility is crucial for creating inclusive web applications. Learn how to build accessible React components using ARIA attributes, semantic HTML, and testing tools. We'll cover everything from basic accessibility to advanced patterns.",
    author: "Jane Smith"
  }
];

export async function seedDatabase() {
  console.log("🌱 Seeding database...");

  try {
    // Insert users
    const insertedUsers = await db.insert(users).values(seedUsers).returning();
    console.log(`✅ Inserted ${insertedUsers.length} users`);

    // Insert posts with author IDs
    const postsWithAuthors = seedPosts.map((post, index) => ({
      ...post,
      authorId: insertedUsers[index % insertedUsers.length].id
    }));

    const insertedPosts = await db
      .insert(posts)
      .values(postsWithAuthors)
      .returning();
    console.log(`✅ Inserted ${insertedPosts.length} posts`);

    console.log("🎉 Database seeded successfully!");
    return { users: insertedUsers, posts: insertedPosts };
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

// Run seed if this file is executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
