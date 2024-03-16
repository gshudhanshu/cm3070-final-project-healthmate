import { create } from "zustand";
import { devtools } from "zustand/middleware";
import axios from "axios";

import { Notification } from "@/types/notification";

interface NotificationState {
  notifications: Notification[];
  fetchNotifications: () => Promise<void>;
  markAsRead: (notificationId: number) => Promise<void>;
  markAsReadAll: () => Promise<void>;
}

const API_URL = process.env.API_URL;
const NOTIFICATIONS_URL = `${API_URL}/notifications/`; // Update with your actual endpoint

export const useNotificationStore = create(
  devtools<NotificationState>((set, get) => ({
    notifications: [],

    fetchNotifications: async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");
        const response = await axios.get(NOTIFICATIONS_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(response.data);
        set({ notifications: response.data });
      } catch (error) {
        console.error("Fetching notifications failed:", error);
        // Handle error, possibly clearing notifications or displaying a message
      }
    },

    markAsRead: async (notificationId) => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");
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
        // Handle error
      }
    },
    markAsReadAll: async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");
        await axios.patch(
          `${NOTIFICATIONS_URL}`,
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
        // Handle error
      }
    },
  })),
);
