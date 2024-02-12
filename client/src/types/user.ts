import { Review } from "./review";

export interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  profile_pic: string | null;
  account_type: string;
}

export interface Slot {
  time: string;
  status: string;
  datetime_utc: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

export interface Language {
  name: string;
  level: string;
}

export interface Qualifications {
  name: string;
  university: string;
  start_year: number;
  finish_year: number;
}

export interface Speciality {
  id: string;
  name: string;
}

export interface DoctorProfile {
  user: User;
  phone: string | null;
  hospital_address?: Address;
  experience: string | null;
  availability: string | null;
  appointment_slots?: Slot[];
  profile_pic: string | null;
  cost: string | null;
  currency: string | null;
  description: string | null;
  specialties?: Speciality[];
  qualifications?: Qualifications[];
  languages?: Language[];
  reviews?: Review[];
  average_rating?: number;
}

export interface PatientProfile {
  user: User;
  phone: string | null;
  dob: string | null;
  marital_status: string | null;
  gender: string | null;
  height: number | null;
  weight: number | null;
  blood_group: string | null;
  languages: Language[];
  address: Address;
  profile_pic: string | null;
}
