import { create } from "zustand";
import { Review } from "@/types/review";
import { devtools } from "zustand/middleware";
import axios from "axios";

const API_URL = process.env.API_URL;

interface ReviewState {
  isLoading: boolean;
  error: Error | null;
  reviews: Review[];
  page: number;
  nextPage: string | null;
  appendReviews: (newReviews: Review[], nextPage: string | null) => void;
  fetchReviews: (doctorUsername: string) => void;
}

export const useReviewStore = create(
  devtools<ReviewState>((set, get) => ({
    isLoading: true,
    error: null,
    reviews: [],
    page: 1,
    nextPage: null,
    appendReviews: (newReviews: Review[], nextPage: string | null) => {
      set((state) => ({
        reviews: [...(state.reviews || []), ...newReviews],
        nextPage: nextPage,
        page: nextPage ? state.page + 1 : state.page,
      }));
    },
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
        const response = await axios.get(url);
        const data = await response.data;

        get().appendReviews(data.results, data.next);

        set({ isLoading: false });
      } catch (error: any) {
        console.error("Failed to fetch reviews:", error);
        set({ error, isLoading: false });
      }
    },
  })),
);
