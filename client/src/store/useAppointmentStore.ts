import { create } from "zustand";
import { devtools } from "zustand/middleware";
import axios from "axios";
import { useAuthStore } from "./useAuthStore";
import { Appointment } from "../types/appointment";

// Define the base URL for the API
const API_URL = process.env.NEXT_PUBLIC_API_URL;
const APPOINTMENTS_URL = `${API_URL}/appointments/`;

// Define the shape of the state managed by the store
interface AppointmentState {
  appointments: Appointment[] | null;
  fetchAppointments: () => Promise<void>;
}

// Create the appointment store with Zustand
export const useAppointmentStore = create(
  devtools<AppointmentState>((set, get) => ({
    appointments: null,
    // Retrieve the JWT token from the auth store
    fetchAppointments: async () => {
      const token = useAuthStore.getState().token;
      try {
        const response = await axios.get(APPOINTMENTS_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // Update the appointments state with the fetched data
        set({ appointments: response.data });
      } catch (error) {
        console.error("Fetching appointments failed:", error);
      }
    },
  })),
);
