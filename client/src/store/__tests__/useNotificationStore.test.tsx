import axios from "axios";
import { act, renderHook, waitFor } from "@testing-library/react";
import { useNotificationStore } from "../useNotificationStore";
import { toast } from "@/components/ui/use-toast";

// Mock axios
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("useNotificationStore", () => {
  // Reset mocks and set token before each test
  beforeEach(() => {
    jest.clearAllMocks();
    window.localStorage.clear();
    window.localStorage.setItem("token", "testToken");
  });

  it("fetches notifications successfully and updates the store", async () => {
    // Mocked notifications data
    const mockNotifications = [{ id: 1, is_read: false }];
    mockedAxios.get.mockResolvedValue({ data: mockNotifications });
    // Render the hook and fetch notifications
    const { result } = renderHook(() => useNotificationStore());
    act(() => {
      result.current.fetchNotifications();
    });
    // Wait for the updates and assert the results
    await waitFor(() => {
      expect(result.current.notifications).toEqual(mockNotifications);
    });
  });

  it("marks a notification as read and updates the store", async () => {
    // Mocked response for marking as read
    mockedAxios.patch.mockResolvedValue({});
    // Render the hook and mark a notification as read
    const { result } = renderHook(() => useNotificationStore());
    await act(async () => {
      result.current.markAsRead(1);
      await waitFor(() =>
        result.current.notifications.some(
          (n) => n.id === 1 && n.is_read === true,
        ),
      );
    });
    // Assert the updated notification state
    expect(
      result.current.notifications.some((n) => n.id === 1 && n.is_read),
    ).toBeTruthy();
  });

  it("marks all notifications as read and updates the store", async () => {
    // Mocked response for marking all as read
    mockedAxios.patch.mockResolvedValue({});
    // Render the hook and mark all notifications as read
    const { result } = renderHook(() => useNotificationStore());
    await act(async () => {
      await result.current.markAsReadAll();
    });
    // Assert all notifications are marked as read
    expect(result.current.notifications.every((n) => n.is_read)).toBeTruthy();
  });
});
