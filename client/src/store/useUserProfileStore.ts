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
  fetchDoctorProfile: (doctorUsername: string) => Promise<DoctorProfile>;
  fetchPatientProfile: (patientUsername: string) => Promise<PatientProfile>;
  updateUserProfile: (
    username: string,
    account_type: string,
    profileData: any,
  ) => void;
}

export const useUserProfileStore = create(
  devtools<DoctorProfileState>((set, get) => ({
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
        return response.data;
      } catch (error: any) {
        set({ error, isLoading: false });
      }
      return undefined;
    },

    fetchPatientProfile: async (patientUsername) => {
      set({ isLoading: true });
      try {
        const response = await axios.get(
          `${API_URL}/user_profile/patients/${patientUsername}/`,
        );
        set({ patientProfile: response.data, isLoading: false });
        return response.data;
      } catch (error: any) {
        set({ error, isLoading: false });
      }
    },

    updateUserProfile: async (username, account_type, profileData) => {
      if (account_type === "patient") {
        const response = await axios.put(
          `${API_URL}/user_profile/patients/${username}/`,
          profileData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
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
            },
          },
        );
        return response.data;
      }
    },
  })),
);
