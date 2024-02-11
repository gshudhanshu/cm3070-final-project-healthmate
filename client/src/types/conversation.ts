import { User } from "./user";

export interface AttachmentResponse {
  id: string;
  file_name: string;
  file_size: string;
  file_extension: string;
  file_url: string;
  file: string;
}

export interface Message {
  id: number;
  sender: User;
  type: string;
  text: string;
  timestamp: string;
  conversation: number;
  attachments: AttachmentResponse[];
  // calls
  caller: User | null;
  receiver: User | null;
  start_time: string;
  end_time: string;
  call_type: string;
}

export interface MessageData {
  conversationId: number;
  sender: number;
  text: string;
  attachments: AttachmentResponse[];
}

export interface Conversation {
  id: number;
  patient: User | null;
  doctor: User | null;
  last_message: Message;
}
