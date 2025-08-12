"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Sun,
  Moon,
  Monitor,
  Menu,
  X,
  Settings,
  Plus,
  Trash2,
  Bell,
  CheckCircle,
  AlertCircle,
  Info,
  XCircle
} from "lucide-react";
import { useUIStore } from "@/lib/stores/ui-store";
import { useFormStore } from "@/lib/stores/form-store";
import { ThemeToggle } from "@/components/theme-toggle";
import { useTheme } from "next-themes";

export default function ZustandSamplePage() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // UI Store
  const {
    sidebarOpen,
    modals,
    notifications,
    loadingStates,

    toggleSidebar,
    setSidebarOpen,
    openModal,
    closeModal,
    addNotification,
    removeNotification,
    clearNotifications,
    setLoading
  } = useUIStore();

  // Form Store
  const {
    forms,
    preferences,
    drafts,
    setFormData,
    setFormErrors,
    setFieldError,
    setFieldTouched,
    setFormValid,
    setFormSubmitting,
    resetForm,
    setPreference,
    saveDraft,
    updateDraft,
    deleteDraft,
    clearDrafts
  } = useFormStore();

  // Update time every second
  useEffect(() => {
    //avoid hydration error
    setMounted(true);
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Auto-save draft when form data changes
  useEffect(() => {
    if (preferences.autoSave && forms.createPost?.data) {
      const { title, body, author } = forms.createPost.data;
      if (title || body || author) {
        saveDraft({
          title: title || "",
          body: body || "",
          author: author || ""
        });
      }
    }
  }, [forms.createPost?.data, preferences.autoSave, saveDraft]);

  const handleFormChange = (field: string, value: string) => {
    setFormData("createPost", field, value);

    // Auto-validation on blur if enabled
    if (preferences.showValidationOnBlur) {
      setFieldTouched("createPost", field, true);

      // Simple validation
      if (field === "title" && value.length < 3) {
        setFieldError(
          "createPost",
          field,
          "Title must be at least 3 characters"
        );
      } else if (field === "body" && value.length < 10) {
        setFieldError(
          "createPost",
          field,
          "Body must be at least 10 characters"
        );
      } else {
        setFieldError("createPost", field, "");
      }
    }
  };

  const handleFormSubmit = async () => {
    setFormSubmitting("createPost", true);
    setLoading("form-submit", true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    addNotification({
      type: "success",
      title: "Post Created!",
      message: "Your post has been successfully created."
    });

    resetForm("createPost");
    setFormSubmitting("createPost", false);
    setLoading("form-submit", false);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-4 w-4" />;
      case "error":
        return <XCircle className="h-4 w-4" />;
      case "warning":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Zustand State Management Demo
          </h1>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="outline" size="sm" onClick={toggleSidebar}>
              {sidebarOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* UI State Demo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                UI State
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mounted ? (
                <div>
                  <Label>Current Theme</Label>

                  <div className="flex gap-2 mt-2">
                    <Button
                      size="sm"
                      variant={theme === "light" ? "default" : "outline"}
                      onClick={() => setTheme("light")}
                      className="flex items-center gap-1"
                    >
                      <Sun className="h-3 w-3" />
                      Light
                    </Button>
                    <Button
                      size="sm"
                      variant={theme === "dark" ? "default" : "outline"}
                      onClick={() => setTheme("dark")}
                      className="flex items-center gap-1"
                    >
                      <Moon className="h-3 w-3" />
                      Dark
                    </Button>
                    <Button
                      size="sm"
                      variant={theme === "system" ? "default" : "outline"}
                      onClick={() => setTheme("system")}
                      className="flex items-center gap-1"
                    >
                      <Monitor className="h-3 w-3" />
                      System
                    </Button>
                  </div>
                </div>
              ) : null}

              <div>
                <Label>Sidebar State</Label>
                <p className="text-sm text-muted-foreground">
                  {sidebarOpen ? "Open" : "Closed"}
                </p>
              </div>

              <div>
                <Label>Active Modals</Label>
                <div className="text-sm text-muted-foreground space-y-1">
                  {Object.entries(modals).map(([modal, isOpen]) => (
                    <div key={modal} className="flex items-center gap-2">
                      <span>{modal}:</span>
                      <span
                        className={isOpen ? "text-green-600" : "text-gray-500"}
                      >
                        {isOpen ? "Open" : "Closed"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Button
                  size="sm"
                  onClick={() => openModal("createPost")}
                  disabled={modals.createPost}
                >
                  Open Create Post Modal
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openModal("settings")}
                  disabled={modals.settings}
                >
                  Open Settings Modal
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openModal("help")}
                  disabled={modals.help}
                >
                  Open Help Modal
                </Button>
              </div>

              <div className="space-y-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() =>
                    addNotification({
                      type: "success",
                      title: "Success!",
                      message: "This is a success notification."
                    })
                  }
                >
                  Add Success Notification
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() =>
                    addNotification({
                      type: "error",
                      title: "Error!",
                      message: "This is an error notification."
                    })
                  }
                >
                  Add Error Notification
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={clearNotifications}
                >
                  Clear All Notifications
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Form State Demo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Form State
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={forms.createPost?.data?.title || ""}
                  onChange={(e) => handleFormChange("title", e.target.value)}
                  onBlur={() => setFieldTouched("createPost", "title", true)}
                  placeholder="Enter post title"
                />
                {forms.createPost?.touched?.title &&
                  forms.createPost?.errors?.title && (
                    <p className="text-sm text-destructive">
                      {forms.createPost.errors.title}
                    </p>
                  )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="body">Body</Label>
                <Textarea
                  id="body"
                  value={forms.createPost?.data?.body || ""}
                  onChange={(e) => handleFormChange("body", e.target.value)}
                  onBlur={() => setFieldTouched("createPost", "body", true)}
                  placeholder="Enter post body"
                  rows={3}
                />
                {forms.createPost?.touched?.body &&
                  forms.createPost?.errors?.body && (
                    <p className="text-sm text-destructive">
                      {forms.createPost.errors.body}
                    </p>
                  )}
                {preferences.showCharacterCount && (
                  <p className="text-xs text-muted-foreground">
                    {(forms.createPost?.data?.body || "").length}/2000
                    characters
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  value={forms.createPost?.data?.author || ""}
                  onChange={(e) => handleFormChange("author", e.target.value)}
                  placeholder="Enter author name"
                />
              </div>

              <Button
                onClick={handleFormSubmit}
                disabled={
                  forms.createPost?.isSubmitting || loadingStates["form-submit"]
                }
                className="w-full"
              >
                {forms.createPost?.isSubmitting
                  ? "Submitting..."
                  : "Submit Form"}
              </Button>

              <Button
                variant="outline"
                onClick={() => resetForm("createPost")}
                className="w-full"
              >
                Reset Form
              </Button>
            </CardContent>
          </Card>

          {/* Preferences & Drafts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Preferences & Drafts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>User Preferences</Label>
                <div className="space-y-2 mt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Auto Save</span>
                    <Button
                      size="sm"
                      variant={preferences.autoSave ? "default" : "outline"}
                      onClick={() =>
                        setPreference("autoSave", !preferences.autoSave)
                      }
                    >
                      {preferences.autoSave ? "On" : "Off"}
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Show Character Count</span>
                    <Button
                      size="sm"
                      variant={
                        preferences.showCharacterCount ? "default" : "outline"
                      }
                      onClick={() =>
                        setPreference(
                          "showCharacterCount",
                          !preferences.showCharacterCount
                        )
                      }
                    >
                      {preferences.showCharacterCount ? "On" : "Off"}
                    </Button>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Draft Posts ({drafts.length})</Label>
                  <Button size="sm" variant="outline" onClick={clearDrafts}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {drafts.map((draft) => (
                    <div key={draft.id} className="p-2 border rounded text-sm">
                      <div className="flex items-center justify-between">
                        <span className="font-medium truncate">
                          {draft.title || "Untitled"}
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteDraft(draft.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {draft.body || "No content"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(draft.lastModified).toLocaleString()}
                      </p>
                    </div>
                  ))}
                  {drafts.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No drafts yet
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notifications */}
        {notifications.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications ({notifications.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {notifications.map((notification) => (
                  <Alert key={notification.id}>
                    {getNotificationIcon(notification.type)}
                    <AlertDescription>
                      <div className="flex items-center justify-between">
                        <div>
                          <strong>{notification.title}</strong>
                          <p className="text-sm">{notification.message}</p>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeNotification(notification.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* State Info */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Current State</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <h4 className="font-medium mb-2">UI State</h4>
                <pre className="bg-muted p-2 rounded text-xs overflow-auto">
                  {JSON.stringify(
                    {
                      sidebarOpen,
                      modals,
                      notificationsCount: notifications.length,
                      loadingStates
                    },
                    null,
                    2
                  )}
                </pre>
              </div>
              <div>
                <h4 className="font-medium mb-2">Form State</h4>
                <pre className="bg-muted p-2 rounded text-xs overflow-auto">
                  {JSON.stringify(
                    {
                      formData: forms.createPost?.data,
                      formErrors: forms.createPost?.errors,
                      formTouched: forms.createPost?.touched,
                      formValid: forms.createPost?.isValid,
                      formSubmitting: forms.createPost?.isSubmitting
                    },
                    null,
                    2
                  )}
                </pre>
              </div>
              <div>
                <h4 className="font-medium mb-2">Preferences & Drafts</h4>
                <pre className="bg-muted p-2 rounded text-xs overflow-auto">
                  {JSON.stringify(
                    {
                      preferences,
                      draftsCount: drafts.length,
                      currentTime: mounted
                        ? currentTime.toLocaleTimeString()
                        : null
                    },
                    null,
                    2
                  )}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
