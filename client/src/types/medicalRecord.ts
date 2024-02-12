import { PatientProfile } from "./user";
import { Appointment } from "./appointment";

export interface Disorder {
  name: string;
  details: string;
  first_noticed: string;
}

export interface Medicine {
  name: string;
  dosage: string;
  start_date: string;
  end_date?: string;
}

export interface Diagnosis {
  name: string;
  details: string;
  date: string;
}

export interface MedicalRecord {
  id: number;
  created_at: string;
  last_updated: string;
  patient: PatientProfile;
  disorders: Disorder[];
  medicines: Medicine[];
  diagnosis: Diagnosis[];
  appointments: Appointment[];
}
