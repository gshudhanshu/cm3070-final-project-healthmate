import { create } from "zustand";
import { devtools } from "zustand/middleware";
import axios from "axios";
import { useAuthStore } from "./useAuthStore";
import { Appointment } from "../types/appointment";

const API_URL = process.env.API_URL;
const APPOINTMENTS_URL = `${API_URL}/appointments/`;

interface AppointmentState {
  appointments: Appointment[] | null;
  fetchAppointments: () => Promise<void>;
}

export const useAppointmentStore = create(
  devtools<AppointmentState>((set, get) => ({
    appointments: null,
    fetchAppointments: async () => {
      const token = useAuthStore.getState().token;
      try {
        const response = await axios.get(APPOINTMENTS_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        set({ appointments: response.data });
      } catch (error) {
        console.error("Fetching appointments failed:", error);
      }
    },
  })),
);
