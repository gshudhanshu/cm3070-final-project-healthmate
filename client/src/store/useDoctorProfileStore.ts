import { create } from "zustand";
import { devtools } from "zustand/middleware";
import axios from "axios";

interface DoctorProfile {
  user: {
    id: number;
    username: string;
    email: string;
  };
  phone: string | null;
  hospital_address: string | null;
  experience: string | null;
  profile_pic: string | null;
  cost: string | null;
  currency: string | null;
  description: string | null;
  specialties: string[];
  qualifications: string[];
  languages: string[];
}

interface DoctorProfileState {
  doctorProfile: DoctorProfile | null;
  isLoading: boolean;
  error: Error | null;
  fetchDoctorProfile: (doctorUsername: string) => void;
}

export const useDoctorProfileStore = create(
  devtools<DoctorProfileState>((set) => ({
    doctorProfile: null,
    isLoading: false,
    error: null,
    fetchDoctorProfile: async (doctorUsername) => {
      set({ isLoading: true });
      try {
        const response = await axios.get(`/api/doctors/${doctorUsername}`);
        set({ doctorProfile: response.data, isLoading: false });
      } catch (error: any) {
        set({ error, isLoading: false });
      }
    },
  })),
);
