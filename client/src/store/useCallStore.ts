import { create } from "zustand";
import SimplePeer from "simple-peer";
import { useMessagesStore } from "@/store/useMessageStore";
import { useAuthStore } from "@/store/useAuthStore";
import axios from "axios";

const API_URL = process.env.API_URL;

interface CallState {
  callData: any;
  conversationId: number | null;
  isCallActive: boolean;
  peer: SimplePeer.Instance | null;
  stream: MediaStream | undefined;
  remoteStream: MediaStream | undefined;
  initiateCall: (conversationId: number) => void;
  startCall: (callData: any, stream: MediaStream) => void;
  handleOffer: (offer: any, stream: MediaStream) => void;
  handleAnswer: (answer: any) => void;
  handleIceCandidate: (candidate: any) => void;
  endCall: () => void;
}

export const useCallStore = create<CallState>((set, get) => ({
  callData: null,
  conversationId: null,
  isCallActive: false,
  peer: null,
  stream: undefined,
  remoteStream: undefined,

  initiateCall: async (conversationId) => {
    const token = useAuthStore.getState().token;
    try {
      const response = await axios.post(
        `${API_URL}/conversations/calls/`,
        {
          conversationId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      set({ callData: response.data, conversationId });
    } catch (error) {
      console.error("Call initiation failed:", error);
      // Handle error
    }
  },

  startCall: (stream) => {
    const { websocket, selectedConversation } = useMessagesStore.getState();
    // const stream = get().stream;
    set({ stream });
    if (!stream || !selectedConversation || !websocket) return;

    const peer = new SimplePeer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      console.log(data, "data");
      if (data.type === "offer") {
        websocket.send(
          JSON.stringify({
            action: "webrtc_offer",
            offer: data,
            conversationId: selectedConversation.id,
          }),
        );
      }
    });

    peer.on("stream", (remoteStream) => {
      set({ remoteStream });
    });

    set({ peer, isCallActive: true });
  },

  handleOffer: (offer, stream) => {
    const { websocket, selectedConversation } = useMessagesStore.getState();
    const peer = new SimplePeer({
      initiator: false,
      trickle: false,
      stream: stream,
    });

    peer.signal(offer);

    peer.on("signal", (data) => {
      if (data.type === "answer") {
        websocket.send(
          JSON.stringify({
            action: "webrtc_answer",
            answer: data,
            conversationId: selectedConversation?.id,
          }),
        );
      }
    });

    peer.on("stream", (remoteStream) => {
      set({ remoteStream });
    });

    set({ peer, isCallActive: true });
  },

  handleAnswer: (answer) => {
    const peer = get().peer;
    if (peer) {
      peer.signal(answer);
    }
  },

  handleIceCandidate: (candidate) => {
    const peer = get().peer;
    if (peer) {
      peer.signal(candidate);
    }
  },

  endCall: () => {
    const { peer, stream } = get();
    if (peer) {
      peer.destroy();
    }
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }

    set({
      callData: null,
      conversationId: null,
      peer: null,
      stream: undefined,
      remoteStream: undefined,
      isCallActive: false,
    });
  },
}));
