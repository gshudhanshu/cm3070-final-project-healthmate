import axios from "axios";
import { act, renderHook, waitFor } from "@testing-library/react";
import { useReviewStore } from "../useReviewStore"; // Adjust the import path to match your project structure
import { toast } from "@/components/ui/use-toast"; // Ensure you have this if you're testing error handling that uses toasts

// Mock axios and toast
jest.mock("axios");
jest.mock("@/components/ui/use-toast", () => ({
  toast: jest.fn(),
}));

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("useReviewStore", () => {
  beforeEach(() => {
    mockedAxios.get.mockClear();
    (toast as jest.Mock).mockClear();
  });

  it("appendReviews correctly updates state", () => {
    const { result } = renderHook(() => useReviewStore());

    expect(result.current.reviews).toEqual([]);
    expect(result.current.page).toEqual(1);

    act(() => {
      result.current.appendReviews(
        [{ id: 1, content: "Great doctor!" }],
        "nextPageUrl",
      );
    });

    expect(result.current.reviews.length).toBe(1);
    expect(result.current.reviews[0].id).toBe(1);
    expect(result.current.nextPage).toBe("nextPageUrl");
    expect(result.current.page).toBe(2); // Page should increment if nextPage is not null
  });

  it("fetchReviews updates state on success", async () => {
    const mockData = {
      results: [{ id: 2, content: "Very professional" }],
      next: null,
    };
    mockedAxios.get.mockResolvedValue({ data: mockData });

    const { result } = renderHook(() => useReviewStore());

    act(() => {
      result.current.fetchReviews("doctorUsername");
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.reviews).toBeTruthy();
      expect(result.current.nextPage).toBeNull();
      expect(result.current.error).toBeNull();
    });
  });
});
