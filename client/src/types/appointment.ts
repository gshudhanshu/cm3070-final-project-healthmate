import { DoctorProfile, User } from "./user";
import { Conversation } from "./conversation";

export interface Appointment {
  id: number;
  doctor: DoctorProfile;
  patient: User;
  date: string;
  time: string;
  datetime_utc: string;
  purpose?: string;
  conversation: Conversation;
}
