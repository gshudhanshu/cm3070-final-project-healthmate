import { create } from "zustand";
import { devtools } from "zustand/middleware";
import axios from "axios";
import { DoctorProfile } from "../types/user";

const API_URL = process.env.API_URL;

interface DoctorProfileState {
  doctorProfile: DoctorProfile | null;
  isLoading: boolean;
  error: Error | null;
  fetchDoctorProfile: (doctorUsername: string) => void;
}

export const useDoctorProfileStore = create(
  devtools<DoctorProfileState>((set) => ({
    doctorProfile: null,
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
  })),
);
