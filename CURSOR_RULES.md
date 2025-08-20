# Cursor Rules for Fotolog Clone Project

## Tech Stack & Architecture

### Core Technologies

- **Next.js 15** with App Router
- **TypeScript** - Always prefer TypeScript over JavaScript
- **Tailwind CSS v4+** with shadcn/ui components (note: v4 has different setup than v3)
- **TanStack Query** for server state management
- **Zustand** for client state management
- **React Hook Form** with Zod validation
- **Drizzle ORM** with SQLite
- **Sonner** for toast notifications

### Project Structure

```
src/
├── app/                    # Next.js App Router pages
├── components/ui/          # shadcn/ui components
├── lib/
│   ├── hooks/             # Custom TanStack Query hooks
│   ├── stores/            # Zustand stores
│   ├── db/                # Database schema and queries
│   └── schemas.ts         # Zod schemas
```

## Code Principles

### 1. KISS & DRY

- **Keep it simple** - Avoid over-engineering solutions
- **Don't repeat yourself** - Extract reusable patterns
- **Prefer built-in solutions** over custom implementations
- **Use the right tool for the job** - Each library has its purpose

### 2. State Management Patterns

- **Server state** → TanStack Query (custom hooks in `lib/hooks/`)
- **Form state** → React Hook Form + Zod
- **UI state** → Zustand (sidebar, modals, etc.)
- **Never mix concerns** - Keep state management focused

### 3. Validation & Type Safety

- **Zod schemas first** - Define validation before types
- **Shared schemas** - Use same schemas for frontend and backend
- **Type inference** - Let TypeScript infer types from Zod schemas
- **Runtime validation** - Always validate API requests/responses

### 4. Component Patterns

- **shadcn/ui components** - Use existing components over custom ones
- **Composition over inheritance** - Build complex UIs from simple components
- **Consistent styling** - Use Tailwind v4 classes and design tokens
- **Accessibility first** - All components should be accessible

## Specific Patterns

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

### Zustand Stores (Client State)

```typescript
// lib/stores/ui-store.ts
interface UIState {
  sidebarOpen: boolean;
  modals: { settings: boolean; help: boolean };

  toggleSidebar: () => void;
  openModal: (modal: keyof UIState["modals"]) => void;
  closeModal: (modal: keyof UIState["modals"]) => void;
}
```

### Form Validation

```typescript
// lib/schemas.ts
export const CreatePostSchema = z.object({
  title: z.string().min(3).max(200),
  body: z.string().min(10).max(2000),
  author: z.string().min(4).max(30)
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

### API Routes

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

  // Process validated data
}
```

## UI/UX Patterns

### Notifications

- **Success/Error feedback** → Sonner toasts
- **Form validation errors** → Inline error messages
- **Loading states** → Skeleton loaders or spinners
- **No alert boxes** - Use toasts for non-blocking feedback

### Modal/Dialog Patterns

- **Use shadcn/ui Dialog** for modals
- **Use shadcn/ui Sheet** for sidebars
- **Proper z-index management** - Let components handle layering
- **Focus management** - Built-in accessibility

### Form Patterns

- **Real-time validation** - Show errors on blur
- **Character counters** - For text inputs with limits
- **Loading states** - Disable submit button during submission
- **Auto-reset** - Clear form after successful submission

## Database Patterns

### Schema Design

```typescript
// lib/db/schema.ts
export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  body: text("body").notNull(),
  author: text("author").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});
```

### Query Patterns

```typescript
// lib/db/queries.ts
export async function getAllPosts() {
  return await db.select().from(posts).orderBy(desc(posts.createdAt));
}

export async function createPost(data: CreatePostData) {
  return await db.insert(posts).values(data).returning();
}
```

## Error Handling

### API Errors

- **Validation errors** - Return 400 with detailed error messages
- **Server errors** - Return 500 with generic message
- **Client handling** - Show user-friendly error messages

### Form Errors

- **Field-level errors** - Show inline validation messages
- **Submit errors** - Show toast notification
- **Network errors** - Graceful fallback with retry options

## Performance Patterns

### Query Optimization

- **Stale time** - Set appropriate cache times
- **Background refetching** - Keep data fresh
- **Optimistic updates** - Update UI immediately, sync later
- **Query invalidation** - Clear cache when data changes

### Component Optimization

- **React.memo** - For expensive components
- **useCallback** - For event handlers passed to children
- **useMemo** - For expensive calculations
- **Code splitting** - Lazy load non-critical components

## Testing Patterns

### Unit Tests

- **Zod schemas** - Test validation logic
- **Custom hooks** - Test state management
- **Utility functions** - Test business logic

### Integration Tests

- **API routes** - Test request/response handling
- **Database queries** - Test data persistence
- **Form submissions** - Test end-to-end flows

## Code Style

### TypeScript

- **Strict mode** - Enable all strict TypeScript options
- **No any types** - Use proper typing or unknown
- **Interface over type** - For object shapes
- **Generic constraints** - When using generics

### Naming Conventions

- **Components** - PascalCase (e.g., `PostCard`)
- **Hooks** - camelCase with "use" prefix (e.g., `usePosts`)
- **Files** - kebab-case (e.g., `use-posts.ts`)
- **Constants** - UPPER_SNAKE_CASE
- **Variables** - camelCase

### File Organization

- **One component per file** - Keep files focused
- **Index exports** - Use barrel exports for clean imports
- **Group related files** - Keep related functionality together
- **Separate concerns** - Keep UI, logic, and data separate

## Common Anti-Patterns to Avoid

### ❌ Don't

- Mix server and client state management
- Use useState for server data
- Create custom components when shadcn/ui exists
- Use alert() or confirm() for user feedback
- Store form state in Zustand (use React Hook Form)
- Use any type in TypeScript
- Create overly complex Zustand stores
- Use inline styles or custom CSS

### ✅ Do

- Use custom hooks for TanStack Query
- Use Zustand only for UI state
- Leverage shadcn/ui components
- Use Sonner for notifications
- Use React Hook Form for forms
- Use proper TypeScript types
- Keep Zustand stores simple
- Use Tailwind v4 CSS classes and `@theme` directive
