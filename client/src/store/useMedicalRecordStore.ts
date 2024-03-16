import { useAuthStore } from "@/store/useAuthStore";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import axios from "axios";
import { MedicalRecord } from "@/types/medicalRecord";
import { toast } from "@/components/ui/use-toast";

const API_URL = process.env.API_URL;
const MEDICAL_RECORDS_URL = `${API_URL}/medical_records`;

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
    fetchMedicalRecords: async (username, conversationId) => {
      const { token } = useAuthStore.getState();
      try {
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
        set({ medicalRecord: response.data });
      } catch (error) {
        console.error("Fetching medical records failed:", error);
      }
    },
    addMedicalRecord: async (recordData) => {
      try {
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
        toast({
          title: "Failed to add medical record",
          description: error.message,
          variant: "destructive",
        });
      }
    },
    updateMedicalRecord: async (recordId, recordData) => {
      try {
        const response = await axios.patch(
          `${MEDICAL_RECORDS_URL}${recordId}/`,
          recordData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
        set((state) => ({ medicalRecord: response.data }));
      } catch (error) {
        console.error("Updating medical record failed:", error);
      }
    },
  })),
);
