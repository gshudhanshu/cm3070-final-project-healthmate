// store/useMessagesStore.ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import axios from "axios";
import { User } from "@/types/user";
import { useAuthStore } from "@/store/useAuthStore";

const API_URL = process.env.API_URL;
const CONVERSATIONS_URL = `${API_URL}/conversations/`;
const SOCKET_URL = `ws://127.0.0.1:8000/socket.io/conversation/4/`;

interface Message {
  id: number;
  sender: User;
  type: string;
  text: string;
  timestamp: string;
  conversation: number;
}

interface Conversation {
  id: number;
  patient: User | null;
  doctor: User | null;
  last_message: Message;
}

interface Attachment {
  name: string;
  type: string;
  size: number;
  content: string; // base64 encoded string
}

interface MessageData {
  conversationId: number;
  sender: number;
  text: string;
  attachments: Attachment[];
}

interface MessagesState {
  websocket: any;
  messages: Message[];
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  isSidebarVisible: boolean;
  fetchConversations: (username: string) => void;
  fetchMessages: (conversationId: number) => void;
  sendMessage: (
    conversationId: number,
    message: string,
    attchements?: Attachment[],
  ) => void;
  selectConversation: (conversations: Conversation) => void;
  toggleSidebar: () => void;
  getOppositeParticipant: (conversation: Conversation) => User | null;
  connectWebSocket: () => void;
  disconnectWebSocket: () => void;
}

export const useMessagesStore = create(
  devtools<MessagesState>((set, get) => ({
    conversations: [],
    messages: [],
    selectedConversation: null,
    isSidebarVisible: true, // Initially, the sidebar is visible
    fetchConversations: async (username: string) => {
      // Placeholder for fetching contacts logic
      console.log("Fetching contacts for user:", username);
      const { token } = useAuthStore.getState();
      const response = await axios.get(`${CONVERSATIONS_URL}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      set({ conversations: response.data });
    },
    fetchMessages: async (conversationId: number) => {
      // Placeholder for fetching messages logic
      console.log("Fetching messages for contact:", conversationId);
      const { token } = useAuthStore.getState();
      const response = await axios.get(
        `${API_URL}/conversations/${conversationId}/messages/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log(response.data);
      set({ messages: response.data });
    },

    selectConversation: (conversation) => {
      set({ selectedConversation: conversation });
      // In mobile view, when a contact is selected, hide the sidebar
      if (window.innerWidth < 768) {
        // or another breakpoint you're using
        set({ isSidebarVisible: false });
      }
    },
    toggleSidebar: () => {
      // Toggle the visibility of the sidebar
      set((state) => ({ isSidebarVisible: !state.isSidebarVisible }));
    },
    getOppositeParticipant: (conversation: Conversation) => {
      const currentUser = useAuthStore.getState().user;
      // Assuming the currentUser will always be either doctor or patient
      return currentUser?.account_type === "doctor"
        ? conversation.patient
        : conversation.doctor;
    },

    // ==============
    // WEB SOCKETS
    // ==============
    websocket: null,

    connectWebSocket: () => {
      const websocket = new WebSocket(
        `${SOCKET_URL}?token=${useAuthStore.getState().token}`,
      );

      websocket.onopen = () => {
        console.log("WebSocket Connected");
      };

      websocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === "new_message") {
          set((state) => ({
            messages: [...state.messages, data.message],
          }));
        }
      };

      set({ websocket });
    },

    disconnectWebSocket: () => {
      get().websocket?.close();
      console.log("WebSocket Disconnected");
      set({ websocket: null });
    },

    sendMessage: async (conversationId, message, attachments = []) => {
      const { user } = useAuthStore.getState();
      if (!user || !get().websocket) return;

      const messageData: MessageData = {
        conversationId,
        sender: user.id,
        text: message,
        attachments: await Promise.all(
          attachments.map(async (file) => {
            const base64 = await convertFileToBase64(file);
            return {
              name: file.name,
              type: file.type,
              size: file.size,
              content: base64 as string,
            };
          }),
        ),
      };

      get().websocket.send(
        JSON.stringify({
          action: "send_message",
          ...messageData,
        }),
      );
    },
  })),
);

// Helper function to convert file to Base64
const convertFileToBase64 = (file: Attachment | Blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    if (file instanceof Blob) {
      reader.readAsDataURL(file);
    } else {
      reject(new Error("Invalid file type"));
    }
  });
