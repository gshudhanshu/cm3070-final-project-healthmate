import { create } from "zustand";
import SimplePeer from "simple-peer";
import { useMessagesStore } from "@/store/useMessageStore";
import { useAuthStore } from "@/store/useAuthStore";
import axios from "axios";

const API_URL = process.env.API_URL;
const SOCKET_URL = `ws://127.0.0.1:8000/`;

interface CallState {
  callWebSocket: any;
  connectCallWebSocket: (callId: string) => void;
  disconnectCallWebSocket: () => void;
  callData: any;
  getCallData: (callId: string) => void;
  conversationId: number | null;
  isCallActive: boolean;
  peer: SimplePeer.Instance | null;
  localStream: MediaStream | undefined;
  remoteStream: MediaStream | undefined;
  initiateCall: (conversationId: number) => void;
  startCall: (stream: MediaStream) => void;
  handleOffer: (offer: any) => void;
  handleAnswer: (answer: any) => void;
  handleIceCandidate: (candidate: any) => void;
  endCall: () => void;
}

export const useCallStore = create<CallState>((set, get) => ({
  callWebSocket: null,
  callData: null,
  conversationId: null,
  isCallActive: false,
  peer: null,
  localStream: undefined,
  remoteStream: undefined,

  getCallData: (callId: string) => {
    const token = useAuthStore.getState().token;
    axios
      .get(`${API_URL}/conversations/calls/${callId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        set({ callData: response.data });
      })
      .catch((error) => {
        console.error("Call data fetch failed:", error);
      });
  },

  initiateCall: async (conversationId: any) => {
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
    }
  },

  // Method to connect to WebSocket for signaling
  connectCallWebSocket: (callId) => {
    const { token, user } = useAuthStore.getState();
    const callWebSocket = new WebSocket(
      `${SOCKET_URL}call/${callId}/?token=${token}`,
    );
    callWebSocket.onopen = () => console.log("Call WebSocket Connected");
    callWebSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      // Handle different types of messages
      console.log("Call WebSocket Message:", data);
      switch (data.type) {
        case "webrtc_offer":
          if (user?.username == get().callData.caller.username) {
            get().handleOffer(data.offer);
          }
          break;
        case "webrtc_answer":
          if (user?.username == get().callData.receiver.username) {
            console.log(get().callData);
            get().handleAnswer(data.answer);
          }
          break;
        case "ice_candidate":
          get().handleIceCandidate(data.candidate);
          break;
        default:
          console.log("Invalid action:", data);
      }
    };
    callWebSocket.onclose = () => console.log("Call WebSocket Disconnected");

    set({ callWebSocket });
  },

  disconnectCallWebSocket: () => {
    get().callWebSocket?.close();
    set({ callWebSocket: null });
  },

  startCall: (stream) => {
    const { callWebSocket, conversationId } = get();
    if (!stream || !callWebSocket) {
      console.log("Invalid stream or callWebSocket");
    }
    const peer = new SimplePeer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      if (data.type === "offer") {
        callWebSocket.send(
          JSON.stringify({
            action: "webrtc_offer",
            offer: data,
            conversationId: conversationId,
          }),
        );
      }
    });

    peer.on("stream", (remoteStream) => {
      console.log("remoteStream", remoteStream);
      set({ remoteStream });
    });

    set({ peer, isCallActive: true });
    console.log("Call started", peer);
  },

  // Method to handle incoming offer
  handleOffer: (offer) => {
    const { callWebSocket, localStream, conversationId } = get();
    const peer = new SimplePeer({
      initiator: false,
      trickle: false,
      stream: localStream,
    });

    // peer.signal(offer);

    peer.on("signal", (data) => {
      if (data.type === "answer") {
        callWebSocket.send(
          JSON.stringify({
            action: "webrtc_answer",
            answer: data,
            conversationId: conversationId,
          }),
        );
      }
    });

    // Stream handling
    peer.on("stream", (remoteStream) => {
      set({ remoteStream });
    });

    // Process received offer
    peer.signal(offer);

    set({ peer, isCallActive: true });
  },

  // Method to handle incoming answer
  handleAnswer: (answer) => {
    const peer = get().peer;
    console.log(peer);
    if (peer) {
      peer.signal(answer);
    }
    console.log("handleAnswer", answer);
  },

  // Method to handle ICE candidates
  handleIceCandidate: (candidate) => {
    const peer = get().peer;
    if (peer) {
      peer.signal(candidate);
    }
  },

  // Method to end the call
  endCall: () => {
    const { peer, localStream } = get();
    if (peer) {
      peer.destroy();
    }
    if (localStream && typeof localStream.getTracks === "function") {
      localStream.getTracks().forEach((track) => track.stop());
    } else {
      console.error("Invalid stream object:", localStream);
    }

    set({
      callData: null,
      conversationId: null,
      peer: null,
      localStream: undefined,
      remoteStream: undefined,
      isCallActive: false,
    });
  },
}));
