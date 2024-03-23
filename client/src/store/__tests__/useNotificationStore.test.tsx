import axios from "axios";
import { act, renderHook, waitFor } from "@testing-library/react";
import { useNotificationStore } from "../useNotificationStore"; // Update this path
import { toast } from "@/components/ui/use-toast";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("useNotificationStore", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.localStorage.clear();
    window.localStorage.setItem("token", "testToken");
  });

  it("fetches notifications successfully and updates the store", async () => {
    const mockNotifications = [{ id: 1, is_read: false }];
    mockedAxios.get.mockResolvedValue({ data: mockNotifications });

    const { result } = renderHook(() => useNotificationStore());
    act(() => {
      result.current.fetchNotifications();
    });

    await waitFor(() => {
      expect(result.current.notifications).toEqual(mockNotifications);
    });
  });

  it("marks a notification as read and updates the store", async () => {
    mockedAxios.patch.mockResolvedValue({});

    const { result } = renderHook(() => useNotificationStore());
    await act(async () => {
      result.current.markAsRead(1);
      await waitFor(() =>
        result.current.notifications.some(
          (n) => n.id === 1 && n.is_read === true,
        ),
      );
    });

    expect(
      result.current.notifications.some((n) => n.id === 1 && n.is_read),
    ).toBeTruthy();
  });

  it("marks all notifications as read and updates the store", async () => {
    mockedAxios.patch.mockResolvedValue({});

    const { result } = renderHook(() => useNotificationStore());
    await act(async () => {
      await result.current.markAsReadAll();
    });

    expect(result.current.notifications.every((n) => n.is_read)).toBeTruthy();
  });
});
