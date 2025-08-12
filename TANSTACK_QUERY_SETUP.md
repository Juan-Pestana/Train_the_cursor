# TanStack Query + Zod + shadcn/ui + Zustand + Drizzle Setup

This project has been configured with TanStack Query (React Query) for efficient server state management, Zod for type-safe validation, shadcn/ui for beautiful, accessible components, Zustand for client-side state management, and Drizzle ORM for type-safe database operations with SQLite.

## What's Included

### 1. **Dependencies Installed**

- `@tanstack/react-query` - Core library for data fetching and caching
- `@tanstack/react-query-devtools` - Development tools for debugging queries
- `zod` - TypeScript-first schema validation library
- `@radix-ui/react-slot` - Radix UI primitives for shadcn/ui
- `@radix-ui/react-label` - Accessible label component
- `class-variance-authority` - Utility for component variants
- `clsx` - Utility for conditional classes
- `tailwind-merge` - Utility for merging Tailwind classes
- `lucide-react` - Beautiful icon library
- `zustand` - Lightweight state management library
- `drizzle-orm` - Type-safe SQL ORM for TypeScript
- `drizzle-kit` - Database toolkit for migrations and schema management
- `@libsql/client` - SQLite client for Drizzle
- `tsx` - TypeScript execution engine for running seed scripts

### 2. **Database Layer (Drizzle ORM)**

#### Database Configuration

- **File**: `src/lib/db/index.ts`
- **Features**:
  - SQLite database with Drizzle ORM
  - Type-safe database client
  - Environment variable support for database URL
  - Schema export for use throughout the application

#### Database Schema

- **File**: `src/lib/db/schema.ts`
- **Tables**:
  - `users` - User information with indexes on email and username
  - `posts` - Blog posts with foreign key relationship to users
- **Features**:
  - Type-safe table definitions
  - Automatic timestamps (createdAt, updatedAt)
  - Indexes for performance optimization
  - Foreign key relationships
  - TypeScript type inference

#### Database Queries

- **File**: `src/lib/db/queries.ts`
- **Features**:
  - Complete CRUD operations for users and posts
  - Type-safe query functions
  - Search functionality with LIKE queries
  - Combined queries with joins
  - Error handling and proper return types

#### Database Seeding

- **File**: `src/lib/db/seed.ts`
- **Features**:
  - Sample data for users and posts
  - Proper foreign key relationships
  - Error handling and logging
  - Executable as standalone script

#### Drizzle Configuration

- **File**: `drizzle.config.ts`
- **Features**:
  - SQLite dialect configuration
  - Schema and migration output paths
  - Database credentials management

### 3. **Database Scripts**

The following npm scripts are available for database management:

```bash
npm run db:generate    # Generate migrations from schema changes
npm run db:migrate     # Apply migrations to database
npm run db:studio      # Open Drizzle Studio for database inspection
npm run db:seed        # Seed the database with sample data
```

### 4. **Provider Setup**

- **File**: `src/app/providers.tsx`
- **Features**:
  - QueryClient configuration with sensible defaults
  - ReactQueryDevtools for development debugging
  - Stale time set to 1 minute
  - Disabled refetch on window focus

### 5. **Layout Integration**

- **File**: `src/app/layout.tsx`
- The app is wrapped with the TanStack Query provider

### 6. **Sample Pages**

#### Basic Demo (`/sample`)

- **File**: `src/app/sample/page.tsx`
- **Features**:
  - Fetches posts from JSONPlaceholder API
  - Demonstrates dependent queries (user data based on selected post)
  - Shows loading states, error handling, and refetch functionality
  - Uses external API for demonstration

#### Zod Validation Demo (`/sample-zod`)

- **File**: `src/app/sample-zod/page.tsx`
- **Features**:
  - Custom API route integration (`/api/posts`)
  - Demonstrates both queries and mutations
  - Form for creating new posts with real-time Zod validation
  - Field-level validation with visual feedback
  - Server-side validation integration
  - Type-safe API communication
  - Comprehensive error handling
  - Optimistic updates and cache invalidation
  - Complete CRUD workflow

#### Zustand State Demo (`/sample-zustand`)

- **File**: `src/app/sample-zustand/page.tsx`
- **Features**:
  - UI state management (theme, sidebar, modals)
  - Form state with validation and auto-save
  - User preferences management
  - Draft posts with persistence
  - Notification system
  - Real-time state visualization
  - Loading states management

#### Database Integration Demo (`/sample-database`)

- **File**: `src/app/sample-database/page.tsx`
- **Features**:
  - Real database integration with SQLite + Drizzle
  - CRUD operations for both users and posts
  - Tabbed interface for managing different data types
  - Search functionality across posts and users
  - Form validation with Zod schemas
  - Optimistic updates and cache invalidation
  - Real-time data synchronization
  - Error handling and user feedback
  - Database statistics display
  - Type-safe database operations

### 7. **API Routes**

#### Posts API (`/api/posts`)

- **File**: `src/app/api/posts/route.ts`
- **Features**:
  - GET endpoint for fetching posts from database
  - POST endpoint for creating posts with Zod validation
  - Database integration with Drizzle ORM
  - Error handling and validation
  - Type-safe database operations

#### Users API (`/api/users`)

- **File**: `src/app/api/users/route.ts`
- **Features**:
  - GET endpoint for fetching users from database
  - POST endpoint for creating users with Zod validation
  - Database integration with Drizzle ORM
  - Error handling and validation
  - Type-safe database operations

### 8. **Zod Schemas & Types**

- **File**: `src/lib/schemas.ts`
- **Features**:
  - Shared schemas for frontend and backend
  - Type inference from schemas
  - Validation helpers and safe parsing
  - Schema composition and transformations
  - Database schema integration

### 9. **shadcn/ui Components**

- **Directory**: `src/components/ui/`
- **Components**:
  - `Button` - Versatile button with multiple variants
  - `Input` - Accessible input field
  - `Textarea` - Accessible textarea
  - `Label` - Accessible label component
  - `Card` - Card container with header, content, and footer
  - `Alert` - Alert component for notifications
- **Features**:
  - Fully accessible components
  - Consistent design system
  - Dark mode support
  - Customizable variants

### 10. **Zustand State Management**

- **Directory**: `src/lib/stores/`
- **Stores**:
  - `ui-store.ts` - UI state (theme, sidebar, modals, notifications)
  - `form-store.ts` - Form state and user preferences
- **Features**:
  - Lightweight and simple API
  - Persistence with localStorage
  - TypeScript support
  - DevTools integration
  - Modular store architecture

## Key Features Demonstrated

### Database Operations

- **Type-safe queries** with Drizzle ORM
- **CRUD operations** for users and posts
- **Foreign key relationships** between tables
- **Search functionality** with LIKE queries
- **Database migrations** and schema management
- **Data seeding** with sample data
- **Real-time data synchronization**

### Queries

- **Basic data fetching** with `useQuery`
- **Dependent queries** (user data based on post selection)
- **Loading states** and error handling
- **Manual refetching** capabilities
- **Query key management**
- **Database-backed queries** with real data

### Mutations

- **Creating data** with `useMutation`
- **Optimistic updates** and cache invalidation
- **Form handling** with controlled inputs
- **Success/error handling**
- **Loading states** during mutations
- **Database mutations** with type safety

### Cache Management

- **Automatic caching** of query results
- **Cache invalidation** after mutations
- **Stale time configuration**
- **Background refetching**
- **Database-aware caching**

### Zod Validation

- **Runtime validation** with detailed error messages
- **Type inference** from schemas
- **Schema composition** and transformations
- **Safe parsing** with error handling
- **Shared validation** between frontend and backend
- **Database schema validation**

### shadcn/ui Components

- **Accessible components** built on Radix UI primitives
- **Consistent design system** with CSS variables
- **Dark mode support** out of the box
- **Customizable variants** using class-variance-authority
- **Beautiful icons** from Lucide React

### Zustand State Management

- **Lightweight state management** with simple API
- **Persistence** with localStorage for user preferences
- **TypeScript support** with full type safety
- **Modular architecture** with separate stores
- **DevTools integration** for debugging
- **Performance optimized** with selective subscriptions

## Database Schema

### Users Table

```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  username TEXT,
  phone TEXT,
  website TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX email_idx ON users(email);
CREATE INDEX username_idx ON users(username);
```

### Posts Table

```sql
CREATE TABLE posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  author TEXT NOT NULL,
  author_id INTEGER REFERENCES users(id),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX author_idx ON posts(author);
CREATE INDEX author_id_idx ON posts(author_id);
CREATE INDEX created_at_idx ON posts(created_at);
```

## Usage Examples

### Database Query

```typescript
// Using Drizzle queries
const { data: posts, isLoading } = useQuery({
  queryKey: ["posts"],
  queryFn: getAllPosts
});

// Using API routes
const { data: users } = useQuery({
  queryKey: ["users"],
  queryFn: () => fetch("/api/users").then((res) => res.json())
});
```

### Database Mutation

```typescript
const createPostMutation = useMutation({
  mutationFn: (postData) =>
    fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(postData)
    }).then((res) => res.json()),
  onSuccess: (newPost) => {
    queryClient.invalidateQueries({ queryKey: ["posts"] });
  }
});
```

### Direct Database Operations

```typescript
// Create a new post directly in database
const newPost = await createPost({
  title: "My New Post",
  body: "Post content...",
  author: "John Doe"
});

// Get posts with author information
const postsWithAuthors = await getPostsWithAuthors();

// Search posts
const searchResults = await searchPosts("query");
```

### Zod Validation with Database

```typescript
// Schema definition
const PostSchema = z.object({
  id: z.number(),
  title: z.string().min(1).max(200),
  body: z.string().min(1).max(2000),
  author: z.string().min(1).max(100),
  createdAt: z.string()
});

// Type inference
type Post = z.infer<typeof PostSchema>;

// Safe parsing
const result = PostSchema.safeParse(data);
if (result.success) {
  // data is now typed as Post
  console.log(result.data);
} else {
  console.log(result.error.issues);
}
```

### Zustand State Management

```typescript
// Store definition
const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      theme: "system",
      sidebarOpen: false,
      setTheme: (theme) => set({ theme }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen }))
    }),
    { name: "ui-store" }
  )
);

// Usage in components
const { theme, setTheme } = useUIStore();
```

## Development Tools

### React Query DevTools

The ReactQueryDevtools are included and can be accessed by:

1. Opening your browser's developer tools
2. Looking for the "React Query" tab
3. This provides real-time insight into your queries, cache, and mutations

### Drizzle Studio

Access the database management interface:

```bash
npm run db:studio
```

This opens a web interface for:

- Viewing and editing data
- Running SQL queries
- Inspecting table schemas
- Managing database structure

## Database Management

### Initial Setup

```bash
# Generate initial migration
npm run db:generate

# Apply migration to create tables
npm run db:migrate

# Seed database with sample data
npm run db:seed
```

### Schema Changes

```bash
# After modifying schema.ts
npm run db:generate

# Apply new migration
npm run db:migrate
```

### Database Inspection

```bash
# Open Drizzle Studio
npm run db:studio
```

## Next Steps

You can now:

1. **Run the development server**: `npm run dev`
2. **Set up the database**:
   - `npm run db:generate` - Generate migrations
   - `npm run db:migrate` - Apply migrations
   - `npm run db:seed` - Seed with sample data
3. **Visit the demos**:
   - Basic demo: `http://localhost:3000/sample`
   - Zod validation demo: `http://localhost:3000/sample-zod`
   - Zustand state demo: `http://localhost:3000/sample-zustand`
   - Database integration demo: `http://localhost:3000/sample-database`
4. **Explore the ReactQueryDevtools** in your browser
5. **Open Drizzle Studio**: `npm run db:studio`
6. **Customize the configuration** in `src/app/providers.tsx`
7. **Add more API routes** following the pattern in `src/app/api/`
8. **Extend schemas** in `src/lib/schemas.ts` for new data types
9. **Create new stores** in `src/lib/stores/` for additional state management
10. **Modify database schema** in `src/lib/db/schema.ts`

## Configuration Options

### QueryClient Configuration

You can customize the QueryClient configuration in `src/app/providers.tsx`:

```typescript
new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // How long data is considered fresh
      refetchOnWindowFocus: false, // Disable refetch on window focus
      retry: 3, // Number of retry attempts
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
    }
  }
});
```

### Database Configuration

Configure the database connection in `src/lib/db/index.ts`:

```typescript
const client = createClient({
  url: process.env.DATABASE_URL || "file:./sqlite.db",
  authToken: process.env.DATABASE_AUTH_TOKEN
});
```

### Drizzle Configuration

Customize Drizzle settings in `drizzle.config.ts`:

```typescript
export default defineConfig({
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle",
  dialect: "sqlite",
  dbCredentials: {
    url: "./sqlite.db"
  }
});
```

## Environment Variables

Create a `.env.local` file for database configuration:

```env
DATABASE_URL=file:./sqlite.db
DATABASE_AUTH_TOKEN=your_auth_token_here
```

## File Structure

```
src/
├── app/
│   ├── api/
│   │   ├── posts/
│   │   │   └── route.ts          # Posts API with database integration
│   │   └── users/
│   │       └── route.ts          # Users API with database integration
│   ├── sample/                   # Basic TanStack Query demo
│   ├── sample-zod/               # Zod validation demo
│   ├── sample-zustand/           # Zustand state management demo
│   ├── sample-database/          # Database integration demo
│   ├── providers.tsx             # TanStack Query provider
│   └── layout.tsx                # App layout with providers
├── components/
│   └── ui/                       # shadcn/ui components
├── lib/
│   ├── db/
│   │   ├── index.ts              # Database client setup
│   │   ├── schema.ts             # Database schema definitions
│   │   ├── queries.ts            # Database query functions
│   │   └── seed.ts               # Database seeding script
│   ├── schemas.ts                # Zod schemas and validation
│   └── stores/                   # Zustand state stores
└── drizzle/                      # Generated migrations
```
