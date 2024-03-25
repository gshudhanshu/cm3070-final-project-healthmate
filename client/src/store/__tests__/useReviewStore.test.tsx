// @ts-nocheck
import axios from "axios";
import { act, renderHook, waitFor } from "@testing-library/react";
import { useReviewStore } from "../useReviewStore";
import { toast } from "@/components/ui/use-toast";

// Mock axios and toast
jest.mock("axios");
jest.mock("@/components/ui/use-toast", () => ({
  toast: jest.fn(),
}));

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("useReviewStore", () => {
  beforeEach(() => {
    // Clear mock function calls before each test
    mockedAxios.get.mockClear();
    (toast as jest.Mock).mockClear();
  });

  it("appendReviews correctly updates state", () => {
    // Render the hook
    const { result } = renderHook(() => useReviewStore());
    // Initial state assertions
    expect(result.current.reviews).toEqual([]);
    expect(result.current.page).toEqual(1);
    // Trigger appendReviews function with mock data
    act(() => {
      result.current.appendReviews(
        [{ id: 1, content: "Great doctor!" }],
        "nextPageUrl",
      );
    });
    // State assertions after appending reviews
    expect(result.current.reviews.length).toBe(1);
    expect(result.current.reviews[0].id).toBe(1);
    expect(result.current.nextPage).toBe("nextPageUrl");
    expect(result.current.page).toBe(2); // Page should increment if nextPage is not null
  });

  it("fetchReviews updates state on success", async () => {
    // Mocked data for successful API response
    const mockData = {
      results: [{ id: 2, content: "Very professional" }],
      next: null,
    };
    mockedAxios.get.mockResolvedValue({ data: mockData });
    // Render the hook
    const { result } = renderHook(() => useReviewStore());
    // Trigger fetchReviews function
    act(() => {
      result.current.fetchReviews("doctorUsername");
    });
    // Wait for state updates and assert the results
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.reviews).toBeTruthy();
      expect(result.current.nextPage).toBeNull();
      expect(result.current.error).toBeNull();
    });
  });
});
