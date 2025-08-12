import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FormState {
  // Form data
  forms: {
    [key: string]: {
      data: Record<string, any>;
      errors: Record<string, string>;
      touched: Record<string, boolean>;
      isValid: boolean;
      isSubmitting: boolean;
    };
  };

  // User preferences
  preferences: {
    autoSave: boolean;
    showValidationOnBlur: boolean;
    showCharacterCount: boolean;
    defaultPostVisibility: "public" | "private" | "draft";
  };

  // Draft posts
  drafts: Array<{
    id: string;
    title: string;
    body: string;
    author: string;
    lastModified: number;
  }>;

  // Actions
  setFormData: (formKey: string, field: string, value: any) => void;
  setFormErrors: (formKey: string, errors: Record<string, string>) => void;
  setFieldError: (formKey: string, field: string, error: string) => void;
  setFieldTouched: (formKey: string, field: string, touched: boolean) => void;
  setFormValid: (formKey: string, isValid: boolean) => void;
  setFormSubmitting: (formKey: string, isSubmitting: boolean) => void;
  resetForm: (formKey: string) => void;

  setPreference: <K extends keyof FormState["preferences"]>(
    key: K,
    value: FormState["preferences"][K]
  ) => void;

  saveDraft: (
    draft: Omit<FormState["drafts"][0], "id" | "lastModified">
  ) => void;
  updateDraft: (id: string, updates: Partial<FormState["drafts"][0]>) => void;
  deleteDraft: (id: string) => void;
  clearDrafts: () => void;
}

export const useFormStore = create<FormState>()(
  persist(
    (set, get) => ({
      // Initial state
      forms: {},
      preferences: {
        autoSave: true,
        showValidationOnBlur: true,
        showCharacterCount: true,
        defaultPostVisibility: "public"
      },
      drafts: [],

      // Actions
      setFormData: (formKey, field, value) =>
        set((state) => ({
          forms: {
            ...state.forms,
            [formKey]: {
              ...state.forms[formKey],
              data: {
                ...state.forms[formKey]?.data,
                [field]: value
              }
            }
          }
        })),

      setFormErrors: (formKey, errors) =>
        set((state) => ({
          forms: {
            ...state.forms,
            [formKey]: {
              ...state.forms[formKey],
              errors
            }
          }
        })),

      setFieldError: (formKey, field, error) =>
        set((state) => ({
          forms: {
            ...state.forms,
            [formKey]: {
              ...state.forms[formKey],
              errors: {
                ...state.forms[formKey]?.errors,
                [field]: error
              }
            }
          }
        })),

      setFieldTouched: (formKey, field, touched) =>
        set((state) => ({
          forms: {
            ...state.forms,
            [formKey]: {
              ...state.forms[formKey],
              touched: {
                ...state.forms[formKey]?.touched,
                [field]: touched
              }
            }
          }
        })),

      setFormValid: (formKey, isValid) =>
        set((state) => ({
          forms: {
            ...state.forms,
            [formKey]: {
              ...state.forms[formKey],
              isValid
            }
          }
        })),

      setFormSubmitting: (formKey, isSubmitting) =>
        set((state) => ({
          forms: {
            ...state.forms,
            [formKey]: {
              ...state.forms[formKey],
              isSubmitting
            }
          }
        })),

      resetForm: (formKey) =>
        set((state) => ({
          forms: {
            ...state.forms,
            [formKey]: {
              data: {},
              errors: {},
              touched: {},
              isValid: false,
              isSubmitting: false
            }
          }
        })),

      setPreference: (key, value) =>
        set((state) => ({
          preferences: { ...state.preferences, [key]: value }
        })),

      saveDraft: (draft) =>
        set((state) => ({
          drafts: [
            ...state.drafts,
            {
              ...draft,
              id: Math.random().toString(36).substr(2, 9),
              lastModified: Date.now()
            }
          ]
        })),

      updateDraft: (id, updates) =>
        set((state) => ({
          drafts: state.drafts.map((draft) =>
            draft.id === id
              ? { ...draft, ...updates, lastModified: Date.now() }
              : draft
          )
        })),

      deleteDraft: (id) =>
        set((state) => ({
          drafts: state.drafts.filter((draft) => draft.id !== id)
        })),

      clearDrafts: () => set({ drafts: [] })
    }),
    {
      name: "form-store",
      partialize: (state) => ({
        preferences: state.preferences,
        drafts: state.drafts
      })
    }
  )
);
