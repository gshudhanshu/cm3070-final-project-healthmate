import { User } from "./user";

export interface Notification {
  id: number;
  recipient: User | null;
  sender: User | null;
  notification_type: string;
  text: string;
  is_read: boolean;
  created_at: string;
}
