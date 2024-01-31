export interface Message {
  id: number;
  sender: string;
  content: string;
  timestamp: string; // Or Date, if you prefer
}

export interface Conversation {
  id: number;
  participant: string;
  lastMessagePreview: string;
  lastMessageTime: string; // Or Date, if you prefer
}
