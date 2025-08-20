import { create } from "zustand";

interface UIState {
  // Sidebar
  sidebarOpen: boolean;

  // Modals
  modals: {
    settings: boolean;
    help: boolean;
  };

  // Actions
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  openModal: (modal: keyof UIState["modals"]) => void;
  closeModal: (modal: keyof UIState["modals"]) => void;
}

export const useUIStore = create<UIState>((set) => ({
  // Initial state
  sidebarOpen: false,
  modals: {
    settings: false,
    help: false
  },
  // Actions
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  openModal: (modal) =>
    set((state) => ({
      modals: { ...state.modals, [modal]: true }
    })),

  closeModal: (modal) =>
    set((state) => ({
      modals: { ...state.modals, [modal]: false }
    }))
}));
