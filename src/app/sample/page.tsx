"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ThemeToggle } from "@/components/theme-toggle";
import { RefreshCw, User, FileText } from "lucide-react";

// Mock API function
const fetchPosts = async (): Promise<
  Array<{ id: number; title: string; body: string }>
> => {
  const response = await fetch(
    "https://jsonplaceholder.typicode.com/posts?_limit=5"
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

const fetchUser = async (
  userId: number
): Promise<{ id: number; name: string; email: string }> => {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/users/${userId}`
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

export default function SamplePage() {
  const [selectedUserId, setSelectedUserId] = useState(1);

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

  // Query for user (dependent on selectedUserId)
  const {
    data: user,
    isLoading: userLoading,
    error: userError
  } = useQuery({
    queryKey: ["user", selectedUserId],
    queryFn: () => fetchUser(selectedUserId),
    enabled: !!selectedUserId
  });

  if (postsLoading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-8">
            TanStack Query Sample
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
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-8">
            TanStack Query Sample
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
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            TanStack Query Sample
          </h1>
          <ThemeToggle />
        </div>

        {/* Posts Section */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Posts
              </CardTitle>
              <Button
                onClick={() => refetchPosts()}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh Posts
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
                    <h3 className="text-lg font-medium text-foreground mb-2">
                      {post.title}
                    </h3>
                    <p className="text-muted-foreground mb-4">{post.body}</p>
                    <Button
                      onClick={() => setSelectedUserId(post.id)}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <User className="h-4 w-4" />
                      View Author (User {post.id})
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* User Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Selected User
            </CardTitle>
          </CardHeader>
          <CardContent>
            {userLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-muted-foreground">Loading user...</p>
              </div>
            ) : userError ? (
              <Alert variant="destructive">
                <AlertDescription>
                  Error loading user: {userError.message}
                </AlertDescription>
              </Alert>
            ) : user ? (
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    {user.name}
                  </h3>
                  <p className="text-muted-foreground">{user.email}</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    User ID: {user.id}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <p className="text-muted-foreground">
                Select a post to view its author
              </p>
            )}
          </CardContent>
        </Card>

        {/* Query Status Info */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Query Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>• Posts loaded: {posts?.length || 0}</p>
              <p>• Selected user ID: {selectedUserId}</p>
              <p>• User loaded: {user ? "Yes" : "No"}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
