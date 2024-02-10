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
  doctor: DoctorProfile;
  doctorUsername: string;
  searchParams: SearchParams;
  pagination: {
    count: number;
    next_page: number;
    previous_page: number;
    current_page: number;
  };
  searchDoctors: () => Promise<void>;
  setSearchParams: (params: SearchParams) => void;
  fetchDoctor: (
    username: string,
    date: string,
    timezone: string,
  ) => Promise<void>;
  bookAppointment: (
    doctorUsername: string,
    datetime_utc: string,
  ) => Promise<void>;
}

export const useFindDocStore = create(
  devtools<FindDocState>((set, get) => ({
    doctors: [],
    doctor: {} as DoctorProfile,
    doctorUsername: "",
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

    fetchDoctor: async (username: string, date: string, timezone: string) => {
      try {
        const response = await axios.get(`${SEARCH_DOCTORS_URL}/${username}`, {
          params: { date, timezone },
        });
        set({ doctor: response.data });
      } catch (error) {
        console.error("Fetching doctor failed:", error);
      }
    },
    bookAppointment: async (doctorUsername: string, datetime_utc: string) => {
      try {
        const response = await axios.post(
          `${API_URL}/appointments/appointment/`,
          {
            doctor: doctorUsername,
            datetime_utc,
          },
        );
        if (response.status === 201)
          console.log("Appointment booked successfully:", response.data);
        else console.error("Booking appointment failed:", response);
      } catch (error) {
        console.error("Booking appointment failed:", error);
      }
    },
  })),
);
