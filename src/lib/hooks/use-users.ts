import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { type User, type ErrorResponse } from "@/lib/schemas";

// API functions with proper typing
const fetchUsers = async (): Promise<User[]> => {
  const response = await fetch("/api/users");
  if (!response.ok) {
    const errorData: ErrorResponse = await response.json();
    throw new Error(errorData.error || "Failed to fetch users");
  }
  return response.json();
};

const createUser = async (userData: User): Promise<User> => {
  const response = await fetch("/api/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(userData)
  });

  const data = await response.json();

  if (!response.ok) {
    const errorData = data as ErrorResponse;
    throw new Error(errorData.error || "Failed to create user");
  }

  return data;
};

// Custom hook for users operations
export function useUsers() {
  const queryClient = useQueryClient();

  // Query for users
  const {
    data: users,
    isLoading: usersLoading,
    error: usersError,
    refetch: refetchUsers
  } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers
  });

  // Mutation for creating users
  const createUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: (newUser) => {
      // Invalidate and refetch users
      queryClient.invalidateQueries({ queryKey: ["users"] });
      console.log("User created successfully:", newUser);
    },
    onError: (error) => {
      console.error("Failed to create user:", error);
    }
  });

  return {
    // Query state
    users,
    usersLoading,
    usersError,
    refetchUsers,

    // Mutation state
    createUser: createUserMutation.mutate,
    createUserAsync: createUserMutation.mutateAsync,
    isCreating: createUserMutation.isPending,
    createError: createUserMutation.error,
    isCreateSuccess: createUserMutation.isSuccess,
    resetCreateMutation: createUserMutation.reset
  };
}
