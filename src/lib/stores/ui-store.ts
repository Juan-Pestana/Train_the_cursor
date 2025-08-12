import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UIState {
  // Sidebar
  sidebarOpen: boolean;

  // Modals
  modals: {
    createPost: boolean;
    settings: boolean;
    help: boolean;
  };

  // Notifications
  notifications: Array<{
    id: string;
    type: "success" | "error" | "warning" | "info";
    title: string;
    message: string;
    timestamp: number;
  }>;

  // Loading states
  loadingStates: {
    [key: string]: boolean;
  };

  // Actions

  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  openModal: (modal: keyof UIState["modals"]) => void;
  closeModal: (modal: keyof UIState["modals"]) => void;
  addNotification: (
    notification: Omit<UIState["notifications"][0], "id" | "timestamp">
  ) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  setLoading: (key: string, loading: boolean) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      // Initial state

      sidebarOpen: false,
      modals: {
        createPost: false,
        settings: false,
        help: false
      },
      notifications: [],
      loadingStates: {},

      // Actions

      toggleSidebar: () =>
        set((state) => ({ sidebarOpen: !state.sidebarOpen })),

      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      openModal: (modal) =>
        set((state) => ({
          modals: { ...state.modals, [modal]: true }
        })),

      closeModal: (modal) =>
        set((state) => ({
          modals: { ...state.modals, [modal]: false }
        })),

      addNotification: (notification) =>
        set((state) => ({
          notifications: [
            ...state.notifications,
            {
              ...notification,
              id: Math.random().toString(36).substr(2, 9),
              timestamp: Date.now()
            }
          ]
        })),

      removeNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id)
        })),

      clearNotifications: () => set({ notifications: [] }),

      setLoading: (key, loading) =>
        set((state) => ({
          loadingStates: { ...state.loadingStates, [key]: loading }
        }))
    }),
    {
      name: "ui-store",
      partialize: (state) => ({
        sidebarOpen: state.sidebarOpen
      })
    }
  )
);
