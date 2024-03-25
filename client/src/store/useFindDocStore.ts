import { create } from "zustand";
import { devtools } from "zustand/middleware";
import qs from "qs";
import axios from "axios";
import { DoctorProfile } from "@/types/user";

import { SearchParams } from "@/types/findDoc";
import { toast } from "@/components/ui/use-toast";

// Define API endpoints
const API_URL = process.env.API_URL;
const SEARCH_DOCTORS_URL = `${API_URL}/user_profile/doctors`;

// Define the shape of the state for finding doctors

interface FindDocState {
  doctors: DoctorProfile[];
  // doctor: DoctorProfile;
  doctorSlots: DoctorProfile;
  doctorUsername: string;
  purpose: string;
  searchParams: SearchParams;
  pagination: {
    count: number;
    total_pages: number;
    next_page: number;
    previous_page: number;
    current_page: number;
  };
  searchDoctors: () => Promise<void>;
  setSearchParams: (params: SearchParams) => void;
  fetchDoctorWithSlots: (
    username: string,
    date: string,
    timezone: string,
  ) => Promise<void>;

  bookAppointment: (
    doctorUsername: string,
    datetime_utc: string,
    purpose: string,
  ) => Promise<void>;
}

export const useFindDocStore = create(
  devtools<FindDocState>((set, get) => ({
    doctors: [],
    doctor: {} as DoctorProfile,
    doctorSlots: {} as DoctorProfile,
    doctorUsername: "",
    purpose: "",
    searchParams: {},
    pagination: {
      count: 0,
      next_page: 0,
      previous_page: 0,
      current_page: 1,
      total_pages: 0,
    },
    // Function to search for doctors
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
        // Update state with search results and pagination information
        set({
          doctors: response.data.results,
          pagination: {
            count: response.data.count,
            next_page: response.data.next_page,
            previous_page: response.data.previous_page,
            current_page: response.data.current_page,
            total_pages: response.data.total_pages,
          },
        });
      } catch (error) {
        console.error("Searching doctors failed:", error);
      }
    },
    // Function to set search parameters
    setSearchParams: (params) => {
      set((state) => ({ searchParams: { ...state.searchParams, ...params } }));
    },

    // Function to fetch doctor with available slots
    fetchDoctorWithSlots: async (
      username: string,
      datetime: string,
      timezone: string,
    ) => {
      let params = {};
      if (datetime || timezone) {
        params = { datetime, timezone };
      }
      try {
        // Send GET request to fetch doctor with available slots
        const response = await axios.get(`${SEARCH_DOCTORS_URL}/${username}`, {
          params: { ...params },
        });

        // Update state with doctor's available slots
        set({ doctorSlots: response.data });
      } catch (error) {
        console.error("Fetching doctor failed:", error);
      }
    },
    // Function to book an appointment
    bookAppointment: async (
      doctorUsername: string,
      datetime_utc: string,
      purpose: string,
    ) => {
      // Send POST request to book an appointment
      try {
        const response = await axios.post(`${API_URL}/appointments/`, {
          doctor: doctorUsername,
          datetime_utc,
          purpose,
        });
        // Handle successful booking
        if (response.status === 201) {
          console.log("Appointment booked successfully:", response.data);
          set({ purpose: "" });
          toast({
            title: "Appointment booked successfully",
            description: "Please come on time for your appointment.",
          });
        } else {
          // Display error message if booking failed
          toast({
            title: "Booking appointment failed",
            description: response?.data || "",
            variant: "destructive",
          });
        }
      } catch (error: any) {
        // Log and display error message if booking failed
        console.error("Booking appointment failed:", error);
        toast({
          title: "Booking appointment failed",
          description:
            error?.message + ". " + error?.response?.data?.error || "",
          variant: "destructive",
        });
      }
    },
  })),
);
