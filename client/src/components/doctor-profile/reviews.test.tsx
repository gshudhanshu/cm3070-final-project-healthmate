// @ts-nocheck
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import ReviewsSection from "./reviews";
import * as reviewStoreHook from "@/store/useReviewStore";
import dayjs from "dayjs";

// Mock the useReviewStore hook
jest.mock("@/store/useReviewStore");

// Mock the doctor object
const mockDoctor = {
  user: {
    username: "johndoe",
    first_name: "John",
    last_name: "Doe",
  },
};

describe("ReviewsSection Component", () => {
  it("displays loading component while reviews are being fetched", () => {
    // Mock the useReviewStore hook to return loading state
    reviewStoreHook.useReviewStore.mockImplementation(() => ({
      isLoading: true,
      error: null,
      reviews: [],
      fetchReviews: jest.fn(),
    }));

    render(<ReviewsSection doctor={mockDoctor} />);
    expect(screen.getByText(/loading.../i)).toBeInTheDocument();
  });

  it("displays error component when there is an error fetching reviews", () => {
    // Mock the useReviewStore hook to return an error
    reviewStoreHook.useReviewStore.mockImplementation(() => ({
      isLoading: false,
      error: "Error fetching reviews",
      reviews: [],
      fetchReviews: jest.fn(),
    }));

    render(<ReviewsSection doctor={mockDoctor} />);
    expect(
      screen.getByText(/an error occurred. please try again./i),
    ).toBeInTheDocument();
  });

  it("renders reviews correctly", () => {
    const mockReviews = [
      {
        patient_name: "Alice",
        date_created: dayjs().format(),
        rating: 4,
        comment: "Great service",
      },
    ];

    // Mock the useReviewStore hook to return the mock reviews
    reviewStoreHook.useReviewStore.mockImplementation(() => ({
      isLoading: false,
      error: null,
      reviews: mockReviews,
      fetchReviews: jest.fn(),
    }));

    render(<ReviewsSection doctor={mockDoctor} />);
    expect(screen.getByText(mockReviews[0].comment)).toBeInTheDocument();
  });

  it('calls fetchReviews when "Load More" is clicked', () => {
    // Mock the useReviewStore hook to return an empty reviews array
    const fetchReviewsMock = jest.fn();
    reviewStoreHook.useReviewStore.mockImplementation(() => ({
      isLoading: false,
      error: null,
      reviews: [],
      fetchReviews: fetchReviewsMock,
      page: 1,
    }));

    render(<ReviewsSection doctor={mockDoctor} />);
    act(() => {
      userEvent.click(screen.getByRole("button", { name: /load more/i }));
    });
    expect(fetchReviewsMock).toHaveBeenCalledWith(mockDoctor.user.username);
  });
});
