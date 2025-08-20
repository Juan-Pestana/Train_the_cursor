"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import {
  Menu,
  X,
  Settings,
  HelpCircle,
  Bell,
  CheckCircle,
  AlertCircle,
  Info,
  XCircle
} from "lucide-react";
import { useUIStore } from "@/lib/stores/ui-store";
import { ThemeToggle } from "@/components/theme-toggle";

export default function ZustandSamplePage() {
  const {
    sidebarOpen,
    modals,
    toggleSidebar,
    setSidebarOpen,
    openModal,
    closeModal
  } = useUIStore();

  const handleAddNotification = (
    type: "success" | "error" | "warning" | "info"
  ) => {
    const notifications = {
      success: {
        title: "Success!",
        message: "Operation completed successfully."
      },
      error: { title: "Error!", message: "Something went wrong." },
      warning: { title: "Warning!", message: "Please check your input." },
      info: { title: "Info", message: "Here's some useful information." }
    };

    const notification = notifications[type];

    switch (type) {
      case "success":
        toast.success(notification.title, {
          description: notification.message
        });
        break;
      case "error":
        toast.error(notification.title, {
          description: notification.message
        });
        break;
      case "warning":
        toast.warning(notification.title, {
          description: notification.message
        });
        break;
      case "info":
        toast.info(notification.title, {
          description: notification.message
        });
        break;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sheet (Sidebar) */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-64">
          <SheetHeader>
            <SheetTitle>Navigation</SheetTitle>
            <SheetDescription>
              Access your main navigation and actions.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <div className="space-y-2">
              <h3 className="font-medium">Navigation</h3>
              <div className="space-y-1">
                <Button variant="ghost" className="w-full justify-start">
                  Dashboard
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  Posts
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  Users
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Actions</h3>
              <div className="space-y-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => openModal("settings")}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => openModal("help")}
                >
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Help
                </Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Dialogs (Modals) */}
      <Dialog
        open={modals.settings}
        onOpenChange={(open) =>
          open ? openModal("settings") : closeModal("settings")
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Settings
            </DialogTitle>
            <DialogDescription>
              Configure your application settings and preferences.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              This is a settings modal. You can add your settings form here.
            </p>
            <div className="flex gap-2">
              <Button onClick={() => closeModal("settings")}>
                Save Changes
              </Button>
              <Button variant="outline" onClick={() => closeModal("settings")}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={modals.help}
        onOpenChange={(open) => (open ? openModal("help") : closeModal("help"))}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              Help
            </DialogTitle>
            <DialogDescription>
              Get help and learn how to use the application.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              This is a help modal. You can add your help content here.
            </p>
            <Button onClick={() => closeModal("help")}>Got it</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Main Content */}
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-foreground">
              Zustand State Management Demo
            </h1>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button
                variant="outline"
                size="sm"
                onClick={toggleSidebar}
                className="flex items-center gap-2"
              >
                <Menu className="h-4 w-4" />
                Toggle Sidebar
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Sidebar Demo */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Menu className="h-5 w-5" />
                  Sidebar State
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  The sidebar state is managed by Zustand and uses shadcn/ui
                  Sheet component. Click the button above to toggle it.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Sidebar Open:</span>
                    <span
                      className={`text-sm font-medium ${
                        sidebarOpen ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {sidebarOpen ? "Yes" : "No"}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => setSidebarOpen(true)}>
                    Open Sidebar
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setSidebarOpen(false)}
                  >
                    Close Sidebar
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Modal Demo */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Modal State
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Modal states are managed by Zustand and use shadcn/ui Dialog
                  components. Click the buttons below to open modals.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Settings Modal:</span>
                    <span
                      className={`text-sm font-medium ${
                        modals.settings ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {modals.settings ? "Open" : "Closed"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Help Modal:</span>
                    <span
                      className={`text-sm font-medium ${
                        modals.help ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {modals.help ? "Open" : "Closed"}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => openModal("settings")}>
                    Open Settings
                  </Button>
                  <Button onClick={() => openModal("help")}>Open Help</Button>
                </div>
              </CardContent>
            </Card>

            {/* Notifications Demo */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Toast notifications using Sonner. Click the buttons below to
                  show different types of notifications.
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleAddNotification("success")}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Success
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleAddNotification("error")}
                    variant="destructive"
                  >
                    Error
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleAddNotification("warning")}
                    className="bg-yellow-600 hover:bg-yellow-700"
                  >
                    Warning
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleAddNotification("info")}
                    variant="outline"
                  >
                    Info
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* State Info */}
            <Card>
              <CardHeader>
                <CardTitle>Zustand Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <div>
                    <h4 className="font-medium mb-2 text-foreground">
                      ✅ Simple State Management
                    </h4>
                    <ul className="space-y-1">
                      <li>• Lightweight and fast</li>
                      <li>• No providers needed</li>
                      <li>• TypeScript support</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2 text-foreground">
                      ✅ UI State Patterns
                    </h4>
                    <ul className="space-y-1">
                      <li>• Sidebar toggles</li>
                      <li>• Modal management</li>
                      <li>• Toast notifications (Sonner)</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2 text-foreground">
                      ✅ Easy to Use
                    </h4>
                    <ul className="space-y-1">
                      <li>• Simple API</li>
                      <li>• Automatic re-renders</li>
                      <li>• DevTools support</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
