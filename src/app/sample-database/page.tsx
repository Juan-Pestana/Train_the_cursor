"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Database,
  Users,
  FileText,
  Plus,
  RefreshCw,
  Search,
  User,
  Calendar,
  Mail,
  Globe,
  Phone
} from "lucide-react";
import { useUIStore } from "@/lib/stores/ui-store";
import { ThemeToggle } from "@/components/theme-toggle";
import { Post, User as UserType } from "@/lib/schemas";

// API functions
const fetchPosts = async () => {
  const response = await fetch("/api/posts");
  if (!response.ok) {
    throw new Error("Failed to fetch posts");
  }
  return (await response.json()) as Post[];
};

const fetchUsers = async () => {
  const response = await fetch("/api/users");
  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }
  return (await response.json()) as UserType[];
};

const createPost = async (postData: {
  title: string;
  body: string;
  author: string;
}) => {
  const response = await fetch("/api/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(postData)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create post");
  }

  return response.json();
};

const createUser = async (userData: {
  name: string;
  email: string;
  username?: string;
  phone?: string;
  website?: string;
}) => {
  const response = await fetch("/api/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(userData)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create user");
  }

  return response.json();
};

export default function DatabaseSamplePage() {
  const queryClient = useQueryClient();
  const { addNotification } = useUIStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"posts" | "users">("posts");

  // Form states
  const [postForm, setPostForm] = useState({
    title: "",
    body: "",
    author: ""
  });

  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    username: "",
    phone: "",
    website: ""
  });

  // Queries
  const {
    data: posts,
    isLoading: postsLoading,
    error: postsError,
    refetch: refetchPosts
  } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts
  });

  const {
    data: users,
    isLoading: usersLoading,
    error: usersError,
    refetch: refetchUsers
  } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers
  });

  // Mutations
  const createPostMutation = useMutation({
    mutationFn: createPost,
    onSuccess: (newPost) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      setPostForm({ title: "", body: "", author: "" });
      addNotification({
        type: "success",
        title: "Post Created!",
        message: `Post "${newPost.title}" has been created successfully.`
      });
    },
    onError: (error) => {
      addNotification({
        type: "error",
        title: "Error",
        message: error.message
      });
    }
  });

  const createUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: (newUser) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setUserForm({
        name: "",
        email: "",
        username: "",
        phone: "",
        website: ""
      });
      addNotification({
        type: "success",
        title: "User Created!",
        message: `User "${newUser.name}" has been created successfully.`
      });
    },
    onError: (error) => {
      addNotification({
        type: "error",
        title: "Error",
        message: error.message
      });
    }
  });

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postForm.title || !postForm.body || !postForm.author) {
      addNotification({
        type: "error",
        title: "Validation Error",
        message: "Please fill in all required fields."
      });
      return;
    }
    createPostMutation.mutate(postForm);
  };

  const handleUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userForm.name || !userForm.email) {
      addNotification({
        type: "error",
        title: "Validation Error",
        message: "Name and email are required."
      });
      return;
    }
    createUserMutation.mutate(userForm);
  };

  const filteredPosts = posts?.filter(
    (post: Post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUsers = users?.filter(
    (user: UserType) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  console.log(posts);

  if (postsLoading || usersLoading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-8">
            Database Integration Demo
          </h1>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">
              Loading data from database...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (postsError || usersError) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-8">
            Database Integration Demo
          </h1>
          <Alert variant="destructive">
            <AlertDescription>
              Error loading data: {postsError?.message || usersError?.message}
            </AlertDescription>
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
            Database Integration Demo
          </h1>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Database className="h-6 w-6 text-primary" />
            <span className="text-sm text-muted-foreground">
              SQLite + Drizzle ORM
            </span>
          </div>
        </div>

        {/* Search and Tabs */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant={activeTab === "posts" ? "default" : "outline"}
                  onClick={() => setActiveTab("posts")}
                  className="flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  Posts ({posts?.length || 0})
                </Button>
                <Button
                  variant={activeTab === "users" ? "default" : "outline"}
                  onClick={() => setActiveTab("users")}
                  className="flex items-center gap-2"
                >
                  <Users className="h-4 w-4" />
                  Users ({users?.length || 0})
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Create Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Create {activeTab === "posts" ? "Post" : "User"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {activeTab === "posts" ? (
                <form onSubmit={handlePostSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={postForm.title}
                      onChange={(e) =>
                        setPostForm({ ...postForm, title: e.target.value })
                      }
                      placeholder="Enter post title"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="body">Content *</Label>
                    <Textarea
                      id="body"
                      value={postForm.body}
                      onChange={(e) =>
                        setPostForm({ ...postForm, body: e.target.value })
                      }
                      placeholder="Enter post content"
                      rows={4}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="author">Author *</Label>
                    <Input
                      id="author"
                      value={postForm.author}
                      onChange={(e) =>
                        setPostForm({ ...postForm, author: e.target.value })
                      }
                      placeholder="Enter author name"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={createPostMutation.isPending}
                    className="w-full"
                  >
                    {createPostMutation.isPending
                      ? "Creating..."
                      : "Create Post"}
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleUserSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      value={userForm.name}
                      onChange={(e) =>
                        setUserForm({ ...userForm, name: e.target.value })
                      }
                      placeholder="Enter full name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={userForm.email}
                      onChange={(e) =>
                        setUserForm({ ...userForm, email: e.target.value })
                      }
                      placeholder="Enter email address"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={userForm.username}
                      onChange={(e) =>
                        setUserForm({ ...userForm, username: e.target.value })
                      }
                      placeholder="Enter username"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={userForm.phone}
                      onChange={(e) =>
                        setUserForm({ ...userForm, phone: e.target.value })
                      }
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={userForm.website}
                      onChange={(e) =>
                        setUserForm({ ...userForm, website: e.target.value })
                      }
                      placeholder="Enter website URL"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={createUserMutation.isPending}
                    className="w-full"
                  >
                    {createUserMutation.isPending
                      ? "Creating..."
                      : "Create User"}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          {/* Data Display */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  {activeTab === "posts" ? (
                    <FileText className="h-5 w-5" />
                  ) : (
                    <Users className="h-5 w-5" />
                  )}
                  {activeTab === "posts" ? "Posts" : "Users"}
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    activeTab === "posts" ? refetchPosts() : refetchUsers()
                  }
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Refresh
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {activeTab === "posts"
                  ? filteredPosts?.map((post: Post) => (
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
                              {new Date(post.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-muted-foreground mb-3 line-clamp-2">
                            {post.body}
                          </p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <User className="h-4 w-4" />
                            {post.author}
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  : filteredUsers?.map((user: UserType) => (
                      <Card
                        key={user.id}
                        className="hover:shadow-md transition-shadow"
                      >
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-medium text-foreground">
                              {user.name}
                            </h3>
                            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                              ID: {user.id}
                            </span>
                          </div>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4" />
                              {user.email}
                            </div>
                            {user.username && (
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4" />@{user.username}
                              </div>
                            )}
                            {user.phone && (
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4" />
                                {user.phone}
                              </div>
                            )}
                            {user.website && (
                              <div className="flex items-center gap-2">
                                <Globe className="h-4 w-4" />
                                <a
                                  href={user.website}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline"
                                >
                                  {user.website}
                                </a>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                {((activeTab === "posts" && filteredPosts?.length === 0) ||
                  (activeTab === "users" && filteredUsers?.length === 0)) && (
                  <p className="text-muted-foreground text-center py-8">
                    No {activeTab} found.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Database Info */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Database Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <h4 className="font-medium mb-2">Database</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• SQLite with Drizzle ORM</li>
                  <li>• Type-safe queries</li>
                  <li>• Automatic migrations</li>
                  <li>• Real-time data</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Features</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• CRUD operations</li>
                  <li>• Data validation</li>
                  <li>• Error handling</li>
                  <li>• Optimistic updates</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Stats</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Posts: {posts?.length || 0}</li>
                  <li>• Users: {users?.length || 0}</li>
                  <li>• Search: {searchQuery ? "Active" : "Inactive"}</li>
                  <li>• Tab: {activeTab}</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
