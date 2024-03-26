import { create } from "zustand";
import { devtools } from "zustand/middleware";
import axios from "axios";

import { Notification } from "@/types/notification";
import { toast } from "@/components/ui/use-toast";

// Define the interface for the notification state
interface NotificationState {
  notifications: Notification[];
  fetchNotifications: () => Promise<void>;
  markAsRead: (notificationId: number) => Promise<void>;
  markAsReadAll: () => Promise<void>;
}

// Define the base URL for notifications endpoint
const API_URL = process.env.NEXT_PUBLIC_API_URL;
const NOTIFICATIONS_URL = `${API_URL}/notifications/`;

export const useNotificationStore = create(
  devtools<NotificationState>((set, get) => ({
    notifications: [],
    // Function to fetch notifications
    fetchNotifications: async () => {
      try {
        const token = localStorage.getItem("token");
        // Throw an error if token is not found
        if (!token) throw new Error("No token found");
        const response = await axios.get(NOTIFICATIONS_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Update notifications state with fetched data
        set({ notifications: response.data });
      } catch (error) {
        console.error("Fetching notifications failed:", error);
      }
    },

    // Function to mark a specific notification as read
    markAsRead: async (notificationId) => {
      try {
        const token = localStorage.getItem("token");
        // Throw an error if token is not found
        if (!token) throw new Error("No token found");
        // Update notification's 'is_read' field to true
        await axios.patch(
          `${NOTIFICATIONS_URL}${notificationId}/`,
          { is_read: true },
          { headers: { Authorization: `Bearer ${token}` } },
        );
        // Update local state to mark notification as read
        set((state) => ({
          notifications: state.notifications.map((notification) =>
            notification.id === notificationId
              ? { ...notification, is_read: true }
              : notification,
          ),
        }));
      } catch (error) {
        console.error("Marking notification as read failed:", error);
      }
    },

    // Function to mark all notifications as read
    markAsReadAll: async () => {
      try {
        const token = localStorage.getItem("token");
        // Throw an error if token is not found
        if (!token) throw new Error("No token found");
        // Update 'is_read' field of all notifications to true
        await axios.patch(
          `${NOTIFICATIONS_URL}mark_all_as_read/`,
          { is_read: true },
          { headers: { Authorization: `Bearer ${token}` } },
        );
        // Update local state to mark all notifications as read
        set((state) => ({
          notifications: state.notifications.map((notification) => ({
            ...notification,
            is_read: true,
          })),
        }));
      } catch (error) {
        console.error("Marking all notifications as read failed:", error);
        // Display toast notification for error
        toast({
          title: "Error",
          description: "Failed to mark all notifications as read",
          variant: "destructive",
        });
      }
    },
  })),
);
