import { create } from "zustand";
import { Review } from "@/types/review";
import { devtools } from "zustand/middleware";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";

// Define the base URL for API requests
const API_URL = process.env.API_URL;

// Define the interface for the review state
interface ReviewState {
  isLoading: boolean;
  error: Error | null;
  reviews: Review[];
  page: number;
  nextPage: string | null;
  appendReviews: (newReviews: Review[], nextPage: string | null) => void;
  fetchReviews: (doctorUsername: string) => void;
  addReview: (review: Review) => void;
  fetchReviewsByConversationId: (conversationId: number) => void;
  reviewByConversationId: Review | null;
}

export const useReviewStore = create(
  devtools<ReviewState>((set, get) => ({
    isLoading: true,
    error: null,
    reviews: [],
    page: 1,
    nextPage: null,
    reviewByConversationId: null,
    // Function to append new reviews to the existing list
    appendReviews: (newReviews: Review[], nextPage: string | null) => {
      // Concatenate newReviews to existing reviews
      set((state) => ({
        reviews: [...(state.reviews || []), ...newReviews],
        nextPage: nextPage,
        page: nextPage ? state.page + 1 : state.page,
      }));
    },
    // Function to fetch reviews for a specific doctor
    fetchReviews: async (doctorUsername: string) => {
      // Prevent fetching if no more pages are available
      if (get().nextPage === null && get().reviews.length > 0) {
        console.log("No more pages to fetch.");
        return;
      }

      set({ isLoading: true });

      try {
        const url =
          get().nextPage ||
          `${API_URL}/user_profile/doctors/${doctorUsername}/reviews/?page=${
            get().page
          }`;
        // const response = await fetch(url);
        // Fetch reviews from the API
        const response = await axios.get(url);
        const data = await response.data;

        // Append fetched reviews to the existing list
        get().appendReviews(data.results, data.next);

        set({ isLoading: false });
      } catch (error: any) {
        console.error("Failed to fetch reviews:", error);
        set({ error, isLoading: false });
      }
    },
    // Function to add a new review
    addReview: async (review: Review) => {
      try {
        const response = await axios.post(
          `${API_URL}/user_profile/reviews/`,
          review,
        );
        const data = await response.data;
        // Add the new review to the beginning of the reviews array
        set((state) => ({
          reviews: [data, ...state.reviews],
        }));
        set({ reviewByConversationId: data });
        // Display toast notification for successful review addition
        toast({
          title: "Review added",
          description: "Your review has been added successfully.",
        });
      } catch (error: any) {
        console.error("Failed to add review:", error);
        // Display toast notification for failed review addition
        toast({
          title: "Failed to add review",
          description: "An error occurred while adding your review.",
          variant: "destructive",
        });
        // Set error if an error occurs while adding the review
        set({ error });
      }
    },

    // Function to fetch a review based on conversation ID
    fetchReviewsByConversationId: async (conversationId: number) => {
      set({ isLoading: true });

      try {
        const response = await axios.get(
          `${API_URL}/user_profile/reviews/${conversationId}`,
        );
        const data = await response.data;
        // Set the reviewByConversationId state with the fetched data
        set({ reviewByConversationId: data, isLoading: false });
      } catch (error: any) {
        console.error("Failed to fetch reviews:", error);
        // Set the reviewByConversationId state with a default value
        set({
          reviewByConversationId: {
            conversation_id: conversationId,
            rating: 1,
            comment: "",
          },
        });
        set({ error, isLoading: false });
      }
    },
  })),
);
