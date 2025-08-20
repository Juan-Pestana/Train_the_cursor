# Modern Full-Stack Setup: Next.js + TanStack Query + Zustand + Zod + shadcn/ui

This project demonstrates a modern, production-ready full-stack setup with clean architecture, type safety, and best practices for React applications.

## Tech Stack

### Core Technologies

- **Next.js 15** with App Router
- **TypeScript** - Strict type safety throughout
- **Tailwind CSS v4+** with `@theme` directive
- **TanStack Query** for server state management
- **Zustand** for client state management
- **React Hook Form** with Zod validation
- **Drizzle ORM** with SQLite
- **Sonner** for toast notifications
- **shadcn/ui** for accessible components

## Project Architecture

### Directory Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── sample/            # Full-stack demo
│   ├── sample-zustand/    # State management demo
│   ├── providers.tsx      # App providers
│   └── layout.tsx         # Root layout
├── components/
│   ├── ui/                # shadcn/ui components
│   └── theme-toggle.tsx   # Theme toggle component
├── lib/
│   ├── hooks/             # Custom TanStack Query hooks
│   ├── stores/            # Zustand stores
│   ├── db/                # Database layer
│   └── schemas.ts         # Zod schemas
└── drizzle/               # Database migrations
```

## Key Features

### 1. **Custom Hooks Pattern** (TanStack Query)

- **Encapsulated API logic** in reusable hooks
- **Type-safe data fetching** with proper error handling
- **Automatic cache management** and invalidation
- **Loading and error states** handled consistently

### 2. **Simplified State Management** (Zustand)

- **UI state only** - Sidebar, modals, theme
- **No form state** - React Hook Form handles forms
- **Clean, focused stores** without over-engineering
- **TypeScript support** with full type safety

### 3. **Modern Form Handling** (React Hook Form + Zod)

- **Real-time validation** with Zod schemas
- **Type-safe forms** with automatic type inference
- **Clean error handling** with inline validation
- **Performance optimized** with minimal re-renders

### 4. **Professional UI Components** (shadcn/ui)

- **Accessible components** built on Radix UI
- **Consistent design system** with Tailwind v4
- **Dark mode support** out of the box
- **Dialog and Sheet components** for modals and sidebars

### 5. **Modern Notifications** (Sonner)

- **Toast notifications** for user feedback
- **Non-blocking UX** with auto-dismiss
- **Theme-aware styling** that adapts to light/dark mode
- **Accessible** with proper ARIA support

## Implementation Examples

### Custom Hooks (TanStack Query)

```typescript
// lib/hooks/use-posts.ts
export function usePosts() {
  const queryClient = useQueryClient();

  const {
    data: posts,
    isLoading,
    error
  } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts
  });

  const createPostMutation = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    }
  });

  return {
    posts,
    isLoading,
    error,
    createPost: createPostMutation.mutate,
    isCreating: createPostMutation.isPending
  };
}
```

### Zustand Store (Client State)

```typescript
// lib/stores/ui-store.ts
interface UIState {
  sidebarOpen: boolean;
  modals: { settings: boolean; help: boolean };

  toggleSidebar: () => void;
  openModal: (modal: keyof UIState["modals"]) => void;
  closeModal: (modal: keyof UIState["modals"]) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: false,
  modals: { settings: false, help: false },

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  openModal: (modal) =>
    set((state) => ({ modals: { ...state.modals, [modal]: true } })),
  closeModal: (modal) =>
    set((state) => ({ modals: { ...state.modals, [modal]: false } }))
}));
```

### Form Validation (React Hook Form + Zod)

```typescript
// lib/schemas.ts
export const CreatePostSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(200),
  body: z.string().min(10, "Body must be at least 10 characters").max(2000),
  author: z.string().min(4, "Author must be at least 4 characters").max(30)
});

// Component usage
const {
  register,
  handleSubmit,
  formState: { errors }
} = useForm<CreatePostData>({
  resolver: zodResolver(CreatePostSchema),
  mode: "onBlur"
});
```

### API Routes with Validation

```typescript
// app/api/posts/route.ts
export async function POST(request: Request) {
  const body = await request.json();
  const validationResult = CreatePostSchema.safeParse(body);

  if (!validationResult.success) {
    return NextResponse.json(
      { error: "Validation failed", details: validationResult.error.issues },
      { status: 400 }
    );
  }

  const newPost = await createPost(validationResult.data);
  return NextResponse.json(newPost, { status: 201 });
}
```

### Toast Notifications (Sonner)

```typescript
// Success notification
useEffect(() => {
  if (isCreateSuccess) {
    toast.success("Post created successfully!", {
      description: "Your post has been added to the list."
    });
  }
}, [isCreateSuccess]);

// Error notification
useEffect(() => {
  if (createError) {
    toast.error("Failed to create post", {
      description: createError.message
    });
  }
}, [createError]);
```

## Demo Pages

### 1. **Full-Stack Demo** (`/sample`)

- **React Hook Form** + Zod validation
- **Custom hooks** for TanStack Query
- **Database integration** with Drizzle ORM
- **Sonner toasts** for user feedback
- **Real-time validation** with error handling

### 2. **State Management Demo** (`/sample-zustand`)

- **Zustand stores** for UI state
- **shadcn/ui Dialog** and Sheet components
- **Sonner toasts** for notifications
- **Theme toggle** with persistence
- **Clean, focused state management**

## Database Layer

### Schema Definition

```typescript
// lib/db/schema.ts
export const posts = sqliteTable("posts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  body: text("body").notNull(),
  author: text("author").notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`)
});
```

### Query Functions

```typescript
// lib/db/queries.ts
export async function getAllPosts() {
  return await db.select().from(posts).orderBy(desc(posts.createdAt));
}

export async function createPost(data: CreatePostData) {
  return await db.insert(posts).values(data).returning();
}
```

## Key Principles

### 1. **Separation of Concerns**

- **Server state** → TanStack Query (custom hooks)
- **Form state** → React Hook Form + Zod
- **UI state** → Zustand (sidebar, modals, theme)
- **Database operations** → Drizzle ORM

### 2. **Type Safety**

- **TypeScript strict mode** enabled
- **Zod schemas** for runtime validation
- **Type inference** from schemas
- **No `any` types** - proper typing throughout

### 3. **Modern Patterns**

- **Custom hooks** for reusable logic
- **Composition over inheritance**
- **Accessibility first** design
- **Performance optimized** components

### 4. **Developer Experience**

- **Hot reload** with Fast Refresh
- **TypeScript IntelliSense** throughout
- **ESLint** and **Prettier** configuration
- **React Query DevTools** for debugging

## Setup Instructions

### 1. **Install Dependencies**

```bash
npm install
```

### 2. **Database Setup**

```bash
npm run db:generate  # Generate migrations
npm run db:migrate   # Apply migrations
npm run db:seed      # Seed with sample data
```

### 3. **Development Server**

```bash
npm run dev
```

### 4. **Visit Demos**

- Full-stack demo: `http://localhost:3000/sample`
- State management demo: `http://localhost:3000/sample-zustand`

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:generate  # Generate database migrations
npm run db:migrate   # Apply database migrations
npm run db:studio    # Open Drizzle Studio
npm run db:seed      # Seed database with sample data
```

## Environment Variables

Create a `.env.local` file:

```env
DATABASE_URL=file:./sqlite.db
```

## Best Practices Demonstrated

### 1. **State Management**

- ✅ **Right tool for the job** - Each library handles its domain
- ✅ **No over-engineering** - Simple, focused stores
- ✅ **Type safety** - Full TypeScript support
- ✅ **Performance** - Optimized re-renders

### 2. **Form Handling**

- ✅ **Real-time validation** - Immediate feedback
- ✅ **Type safety** - Zod schemas with TypeScript
- ✅ **Performance** - Minimal re-renders
- ✅ **Accessibility** - Proper ARIA attributes

### 3. **API Design**

- ✅ **Validation first** - Zod schemas for all inputs
- ✅ **Error handling** - Comprehensive error responses
- ✅ **Type safety** - Shared types between frontend and backend
- ✅ **RESTful design** - Clear API contracts

### 4. **UI/UX**

- ✅ **Accessible components** - Built on Radix UI
- ✅ **Modern notifications** - Non-blocking toasts
- ✅ **Dark mode support** - Theme-aware components
- ✅ **Responsive design** - Mobile-first approach

### 5. **Database Operations**

- ✅ **Type-safe queries** - Drizzle ORM with TypeScript
- ✅ **Migration system** - Version-controlled schema changes
- ✅ **Seeding** - Sample data for development
- ✅ **Studio interface** - Visual database management

## Next Steps

1. **Customize the design** - Modify Tailwind theme in `globals.css`
2. **Add more API routes** - Follow the pattern in `app/api/`
3. **Extend schemas** - Add new Zod schemas in `lib/schemas.ts`
4. **Create new hooks** - Add custom TanStack Query hooks in `lib/hooks/`
5. **Add authentication** - Integrate NextAuth.js or similar
6. **Deploy to production** - Use Vercel, Netlify, or your preferred platform

This setup provides a solid foundation for building modern, scalable React applications with excellent developer experience and user experience.
