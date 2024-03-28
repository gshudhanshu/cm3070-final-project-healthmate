import { create } from "zustand";
import { devtools } from "zustand/middleware";
import axios from "axios";
import { DoctorProfile, PatientProfile } from "../types/user";
import { useAuthStore } from "@/store/useAuthStore";

// Define the base URL for API requests
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Define the interface for the doctor profile state
interface DoctorProfileState {
  doctorProfile: DoctorProfile | null;
  otherDoctorProfile: DoctorProfile | null;
  patientProfile: PatientProfile | null;
  isLoading: boolean;
  error: Error | null;
  // Function to fetch a doctor's profile
  fetchDoctorProfile: (
    doctorUsername: string,
    otherDoctor?: boolean,
  ) => Promise<DoctorProfile>;
  // Function to fetch a patient's profile
  fetchPatientProfile: (patientUsername: string) => Promise<PatientProfile>;
  // Function to update a user's profile
  updateUserProfile: (
    username: string,
    account_type: string,
    profileData: any,
  ) => void;
}

export const useUserProfileStore = create(
  devtools<DoctorProfileState>((set, get) => ({
    doctorProfile: null,
    otherDoctorProfile: null,
    patientProfile: null,
    isLoading: true,
    error: null,
    // Function to fetch a doctor's profile
    fetchDoctorProfile: async (doctorUsername, otherDoctor = false) => {
      set({ isLoading: true });
      const token = useAuthStore.getState().token;
      try {
        // Fetch doctor's profile from the API
        const response = await axios.get(
          `${API_URL}/user_profile/doctors/${doctorUsername}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        if (otherDoctor) {
          // Store other doctor's profile data
          set({ otherDoctorProfile: response.data, isLoading: false });
        } else {
          // Store doctor's profile data
          set({ doctorProfile: response.data, isLoading: false });
        }
        return response.data;
      } catch (error: any) {
        // Set error and isLoading to false if an error occurs
        set({ error, isLoading: false });
      }
      // return undefined;
    },

    // Function to fetch a patient's profile
    fetchPatientProfile: async (patientUsername) => {
      set({ isLoading: true });
      const token = useAuthStore.getState().token;
      try {
        // Fetch patient's profile from the API

        const response = await axios.get(
          `${API_URL}/user_profile/patients/${patientUsername}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        // Store patient's profile data
        set({ patientProfile: response.data, isLoading: false });
        return response.data;
      } catch (error: any) {
        // Set error and isLoading to false if an error occurs
        set({ error, isLoading: false });
      }
    },

    // Function to update a user's profile
    updateUserProfile: async (username, account_type, profileData) => {
      // Determine whether the user is a patient or doctor and send a PUT request accordingly
      const token = useAuthStore.getState().token;
      if (account_type === "patient") {
        const response = await axios.put(
          `${API_URL}/user_profile/patients/${username}/`,
          profileData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          },
        );
        return response.data;
      }
      if (account_type === "doctor") {
        const response = await axios.put(
          `${API_URL}/user_profile/doctors/${username}/`,
          profileData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          },
        );
        // Return updated profile data
        return response.data;
      }
    },
  })),
);
