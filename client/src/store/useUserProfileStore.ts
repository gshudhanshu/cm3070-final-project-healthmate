import { create } from "zustand";
import { devtools } from "zustand/middleware";
import axios from "axios";
import { DoctorProfile, PatientProfile } from "../types/user";

const API_URL = process.env.API_URL;

interface DoctorProfileState {
  doctorProfile: DoctorProfile | null;
  patientProfile: PatientProfile | null;
  isLoading: boolean;
  error: Error | null;
  fetchDoctorProfile: (doctorUsername: string) => void;
  fetchPatientProfile: (patientUsername: string) => void;
  updateUserProfile: (
    username: string,
    account_type: string,
    profileData: any,
  ) => void;
}

export const useUserProfileStore = create(
  devtools<DoctorProfileState>((set) => ({
    doctorProfile: null,
    patientProfile: null,
    isLoading: true,
    error: null,
    fetchDoctorProfile: async (doctorUsername) => {
      set({ isLoading: true });
      try {
        const response = await axios.get(
          `${API_URL}/user_profile/doctors/${doctorUsername}/`,
        );
        set({ doctorProfile: response.data, isLoading: false });
      } catch (error: any) {
        set({ error, isLoading: false });
      }
    },

    fetchPatientProfile: async (patientUsername) => {
      set({ isLoading: true });
      try {
        const response = await axios.get(
          `${API_URL}/user_profile/patients/${patientUsername}/`,
        );
        set({ patientProfile: response.data, isLoading: false });
      } catch (error: any) {
        set({ error, isLoading: false });
      }
    },

    updateUserProfile: async (username, account_type, profileData) => {
      if (account_type === "patient") {
        const response = await axios.put(
          `${API_URL}/user_profile/patients/${username}/`,
          profileData,
        );
        return response.data;
      }
      if (account_type === "doctor") {
        const response = await axios.put(
          `${API_URL}/user_profile/doctors/${username}/`,
          profileData,
        );
        return response.data;
      }
    },
  })),
);
