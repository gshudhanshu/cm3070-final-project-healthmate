import { create } from "zustand";
import { devtools } from "zustand/middleware";
import qs from "qs";
import axios from "axios";
import { DoctorProfile } from "@/types/user";

const API_URL = process.env.API_URL;
const SEARCH_DOCTORS_URL = `${API_URL}/user_profile/doctors`;

interface SearchParams {
  name?: string;
  location?: string;
  speciality?: string[];
  priceRange?: [number, number];
  experience?: string[];
  qualifications?: string[];
  languages?: string[];
  page?: number;
  [key: string]: any;
}

interface FindDocState {
  doctors: DoctorProfile[];
  searchParams: SearchParams;
  pagination: {
    count: number;
    next_page: number;
    previous_page: number;
    current_page: number;
  };
  searchDoctors: () => Promise<void>;
  setSearchParams: (params: SearchParams) => void;
}

export const useFindDocStore = create(
  devtools<FindDocState>((set, get) => ({
    doctors: [],
    searchParams: {},
    pagination: {
      count: 0,
      next_page: 0,
      previous_page: 0,
      current_page: 1,
    },
    searchDoctors: async () => {
      const { searchParams } = get();
      console.log("Searching doctors with params:", searchParams);
      try {
        const response = await axios.get(SEARCH_DOCTORS_URL, {
          params: searchParams,
          paramsSerializer: (params) => {
            return qs.stringify(params, {
              arrayFormat: "comma",
              encode: false,
            });
          },
        });
        set({
          doctors: response.data.results,
          pagination: {
            count: response.data.count,
            next_page: response.data.next_page,
            previous_page: response.data.previous_page,
            current_page: response.data.current_page,
          },
        });
      } catch (error) {
        console.error("Searching doctors failed:", error);
      }
    },
    setSearchParams: (params) => {
      set((state) => ({ searchParams: { ...state.searchParams, ...params } }));
    },
  })),
);
