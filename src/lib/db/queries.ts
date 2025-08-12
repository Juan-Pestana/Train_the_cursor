import { eq, desc, asc, like } from "drizzle-orm";
import { db, posts, users, type NewPost, type NewUser } from "./index";

// Post queries
export async function getAllPosts() {
  return await db.select().from(posts).orderBy(desc(posts.createdAt));
}

export async function getPostById(id: number) {
  const result = await db.select().from(posts).where(eq(posts.id, id));
  return result[0];
}

export async function getPostsByAuthor(author: string) {
  return await db
    .select()
    .from(posts)
    .where(eq(posts.author, author))
    .orderBy(desc(posts.createdAt));
}

export async function createPost(post: NewPost) {
  const result = await db.insert(posts).values(post).returning();
  return result[0];
}

export async function updatePost(id: number, updates: Partial<NewPost>) {
  const result = await db
    .update(posts)
    .set({ ...updates, updatedAt: new Date().toISOString() })
    .where(eq(posts.id, id))
    .returning();
  return result[0];
}

export async function deletePost(id: number) {
  const result = await db.delete(posts).where(eq(posts.id, id)).returning();
  return result[0];
}

export async function searchPosts(query: string) {
  return await db
    .select()
    .from(posts)
    .where(like(posts.title, `%${query}%`))
    .orderBy(desc(posts.createdAt));
}

// User queries
export async function getAllUsers() {
  return await db.select().from(users).orderBy(asc(users.name));
}

export async function getUserById(id: number) {
  const result = await db.select().from(users).where(eq(users.id, id));
  return result[0];
}

export async function getUserByEmail(email: string) {
  const result = await db.select().from(users).where(eq(users.email, email));
  return result[0];
}

export async function createUser(user: NewUser) {
  const result = await db.insert(users).values(user).returning();
  return result[0];
}

export async function updateUser(id: number, updates: Partial<NewUser>) {
  const result = await db
    .update(users)
    .set({ ...updates, updatedAt: new Date().toISOString() })
    .where(eq(users.id, id))
    .returning();
  return result[0];
}

export async function deleteUser(id: number) {
  const result = await db.delete(users).where(eq(users.id, id)).returning();
  return result[0];
}

// Combined queries
export async function getPostsWithAuthors() {
  return await db
    .select({
      id: posts.id,
      title: posts.title,
      body: posts.body,
      author: posts.author,
      createdAt: posts.createdAt,
      updatedAt: posts.updatedAt,
      user: {
        id: users.id,
        name: users.name,
        email: users.email,
        username: users.username
      }
    })
    .from(posts)
    .leftJoin(users, eq(posts.authorId, users.id))
    .orderBy(desc(posts.createdAt));
}

export async function getUserWithPosts(userId: number) {
  const user = await getUserById(userId);
  if (!user) return null;

  const userPosts = await db
    .select()
    .from(posts)
    .where(eq(posts.authorId, userId))
    .orderBy(desc(posts.createdAt));

  return {
    ...user,
    posts: userPosts
  };
}
