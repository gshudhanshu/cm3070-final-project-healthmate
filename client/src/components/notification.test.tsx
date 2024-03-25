// @ts-nocheck
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { Notification } from "./notification";
import * as NotificationStore from "@/store/useNotificationStore";
import * as AuthStore from "@/store/useAuthStore";
import userEvent from "@testing-library/user-event";

// Mock the useNotificationStore and useAuthStore hooks
jest.mock("@/store/useNotificationStore");
jest.mock("@/store/useAuthStore");

// Mock the fetchNotifications, markAsRead, and markAsReadAll functions
const mockFetchNotifications = jest.fn();
const mockMarkAsRead = jest.fn();
const mockMarkAsReadAll = jest.fn();

describe("Notification Component", () => {
  beforeEach(() => {
    // Mock the return value of useNotificationStore hook
    NotificationStore.useNotificationStore.mockReturnValue({
      fetchNotifications: mockFetchNotifications,
      notifications: [],
      markAsRead: mockMarkAsRead,
      markAsReadAll: mockMarkAsReadAll,
    });

    // Mock the return value of useAuthStore hook
    AuthStore.useAuthStore.mockReturnValue({
      // Simulate a logged-in user
      user: { id: 1, name: "John Doe" },
    });
  });

  it("renders without crashing", () => {
    render(<Notification />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("fetches notifications on user login", async () => {
    render(<Notification />);
    // Wait for the fetchNotifications function to be called
    await waitFor(() => expect(mockFetchNotifications).toHaveBeenCalled());
  });

  it('displays "No notifications" when there are none', async () => {
    render(<Notification />);
    // Click the button to open notifications
    await userEvent.click(screen.getByRole("button"));
    // Expect the "No notifications" text to be present
    expect(screen.getByText("No notifications")).toBeInTheDocument();
  });

  it("displays notifications when present", async () => {
    // Mock the return value of useNotificationStore hook to include notifications
    NotificationStore.useNotificationStore.mockReturnValueOnce({
      fetchNotifications: mockFetchNotifications,
      notifications: [
        { id: 1, text: "New message", is_read: false, created_at: new Date() },
      ],
      markAsRead: mockMarkAsRead,
      markAsReadAll: mockMarkAsReadAll,
    });

    render(<Notification />);
    // Click the button to open notifications
    await userEvent.click(screen.getByRole("button"));
    expect(screen.getByText("New message")).toBeInTheDocument();
  });

  it("marks all notifications as read", async () => {
    // Mock the return value of useNotificationStore hook to include notifications
    NotificationStore.useNotificationStore.mockReturnValueOnce({
      fetchNotifications: mockFetchNotifications,
      notifications: [
        { id: 1, text: "New message", is_read: false, created_at: new Date() },
      ],
      markAsRead: mockMarkAsRead,
      markAsReadAll: mockMarkAsReadAll,
    });

    render(<Notification />);
    // Click the button to open notifications
    await userEvent.click(screen.getByRole("button"));
    // Click the "Read all" button
    fireEvent.click(screen.getByText("Read all"));
    expect(mockMarkAsReadAll).toHaveBeenCalledTimes(1);
  });

  it("marks an individual notification as read", async () => {
    // Mock the return value of useNotificationStore hook to include notifications
    NotificationStore.useNotificationStore.mockReturnValueOnce({
      fetchNotifications: mockFetchNotifications,
      notifications: [
        { id: 1, text: "New message", is_read: false, created_at: new Date() },
      ],
      markAsRead: mockMarkAsRead,
      markAsReadAll: mockMarkAsReadAll,
    });

    render(<Notification />);
    // Click the button to open notifications
    await userEvent.click(screen.getByRole("button"));
    // Click the "Mark as read" button for the first notification
    fireEvent.click(screen.getAllByTestId("mark-as-read-button")[0]);
    // Expect the markAsRead function to be called with the correct notification ID
    expect(mockMarkAsRead).toHaveBeenCalledWith(1);
  });
});
