import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { Notification } from "./notification"; // Adjust the import path as needed
import * as NotificationStore from "@/store/useNotificationStore";
import * as AuthStore from "@/store/useAuthStore";
import userEvent from "@testing-library/user-event";

jest.mock("@/store/useNotificationStore");
jest.mock("@/store/useAuthStore");

const mockFetchNotifications = jest.fn();
const mockMarkAsRead = jest.fn();
const mockMarkAsReadAll = jest.fn();

describe("Notification Component", () => {
  beforeEach(() => {
    NotificationStore.useNotificationStore.mockReturnValue({
      fetchNotifications: mockFetchNotifications,
      notifications: [],
      markAsRead: mockMarkAsRead,
      markAsReadAll: mockMarkAsReadAll,
    });

    AuthStore.useAuthStore.mockReturnValue({
      user: { id: 1, name: "John Doe" }, // Simulate a logged-in user
    });
  });

  it("renders without crashing", () => {
    render(<Notification />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("fetches notifications on user login", async () => {
    render(<Notification />);
    await waitFor(() => expect(mockFetchNotifications).toHaveBeenCalled());
  });

  it('displays "No notifications" when there are none', async () => {
    render(<Notification />);
    await userEvent.click(screen.getByRole("button"));
    expect(screen.getByText("No notifications")).toBeInTheDocument();
  });

  it("displays notifications when present", async () => {
    NotificationStore.useNotificationStore.mockReturnValueOnce({
      fetchNotifications: mockFetchNotifications,
      notifications: [
        { id: 1, text: "New message", is_read: false, created_at: new Date() },
      ],
      markAsRead: mockMarkAsRead,
      markAsReadAll: mockMarkAsReadAll,
    });

    render(<Notification />);
    await userEvent.click(screen.getByRole("button"));
    expect(screen.getByText("New message")).toBeInTheDocument();
  });

  it("marks all notifications as read", async () => {
    NotificationStore.useNotificationStore.mockReturnValueOnce({
      fetchNotifications: mockFetchNotifications,
      notifications: [
        { id: 1, text: "New message", is_read: false, created_at: new Date() },
      ],
      markAsRead: mockMarkAsRead,
      markAsReadAll: mockMarkAsReadAll,
    });

    render(<Notification />);
    await userEvent.click(screen.getByRole("button"));
    fireEvent.click(screen.getByText("Read all"));
    expect(mockMarkAsReadAll).toHaveBeenCalledTimes(1);
  });

  it("marks an individual notification as read", async () => {
    NotificationStore.useNotificationStore.mockReturnValueOnce({
      fetchNotifications: mockFetchNotifications,
      notifications: [
        { id: 1, text: "New message", is_read: false, created_at: new Date() },
      ],
      markAsRead: mockMarkAsRead,
      markAsReadAll: mockMarkAsReadAll,
    });

    render(<Notification />);
    await userEvent.click(screen.getByRole("button"));
    fireEvent.click(screen.getAllByTestId("mark-as-read-button")[0]);
    expect(mockMarkAsRead).toHaveBeenCalledWith(1);
  });
});
