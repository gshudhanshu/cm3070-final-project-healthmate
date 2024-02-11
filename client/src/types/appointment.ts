import { User } from "./user";
import { Conversation } from "./conversation";

export interface Appointment {
  id: number;
  doctor: User;
  patient: User;
  date: string;
  time: string;
  purpose?: string;
  conversation: Conversation;
}
