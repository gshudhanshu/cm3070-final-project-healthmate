import { create } from "zustand";
import SimplePeer from "simple-peer";
import { useMessagesStore } from "@/store/useMessageStore";

interface CallState {
  isCallActive: boolean;
  peer: SimplePeer.Instance | null;
  stream: MediaStream | undefined;
  remoteStream: MediaStream | undefined;
  startCall: (stream: MediaStream) => void;
  handleOffer: (offer: any, stream: MediaStream) => void;
  handleAnswer: (answer: any) => void;
  handleIceCandidate: (candidate: any) => void;
  endCall: () => void;
}

export const useCallStore = create<CallState>((set, get) => ({
  isCallActive: false,
  peer: null,
  stream: undefined,
  remoteStream: undefined,

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
      peer: null,
      stream: undefined,
      remoteStream: undefined,
      isCallActive: false,
    });
  },
}));
