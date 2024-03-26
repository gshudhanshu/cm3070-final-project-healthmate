import { useAuthStore } from "@/store/useAuthStore";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import axios from "axios";
import { MedicalRecord } from "@/types/medicalRecord";
import { toast } from "@/components/ui/use-toast";

// Define the base URL for medical records endpoint
const API_URL = process.env.NEXT_PUBLIC_API_URL;
const MEDICAL_RECORDS_URL = `${API_URL}/medical_records`;

// Define the interface for the medical records state
interface MedicalRecordsState {
  medicalRecord: MedicalRecord | null;
  fetchMedicalRecords: (
    username: string,
    conversation_id?: any,
  ) => Promise<void>;
  addMedicalRecord: (recordData: Partial<MedicalRecord>) => Promise<void>;
  updateMedicalRecord: (
    recordId: number,
    recordData: Partial<MedicalRecord>,
  ) => Promise<void>;
}

export const useMedicalRecordsStore = create(
  devtools<MedicalRecordsState>((set, get) => ({
    medicalRecord: null,
    // Function to fetch medical records for a user
    fetchMedicalRecords: async (username, conversationId) => {
      const { token } = useAuthStore.getState();
      try {
        // Fetch medical records from the API
        const response = await axios.get(`${MEDICAL_RECORDS_URL}/`, {
          params: {
            username,
            conversation_id: conversationId,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response);
        // Update medicalRecord state
        set({ medicalRecord: response.data });
      } catch (error) {
        console.error("Fetching medical records failed:", error);
      }
    },
    // Function to add a new medical record
    addMedicalRecord: async (recordData) => {
      try {
        // Send a POST request to add the medical record
        const response = await axios.post(
          `${MEDICAL_RECORDS_URL}/`,
          recordData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
        // set((state) => ({
        //   medicalRecord: response.data,
        // }));

        toast({
          title: "Medical record added",
          description: "New medical record has been added",
        });
      } catch (error: any) {
        // Handle errors
        toast({
          title: "Failed to add medical record",
          description: error.message,
          variant: "destructive",
        });
      }
    },
    // Function to update an existing medical record
    updateMedicalRecord: async (recordId, recordData) => {
      try {
        // Send a PATCH request to update the medical record
        const response = await axios.patch(
          `${MEDICAL_RECORDS_URL}${recordId}/`,
          recordData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
        // Update medicalRecord state
        set((state) => ({ medicalRecord: response.data }));
      } catch (error) {
        console.error("Updating medical record failed:", error);
      }
    },
  })),
);
