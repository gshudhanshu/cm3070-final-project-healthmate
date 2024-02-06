"use client";

import React, { useEffect, useRef, useState } from "react";
import SimplePeer from "simple-peer";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallStore } from "@/store/useCallStore";

const CallPage = () => {
  const searchParams = useSearchParams();
  const callId = searchParams.get("callId");
  const conversationId = searchParams.get("conversationId");
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  const {
    stream,
    peer,
    startCall,
    handleOffer,
    handleAnswer,
    handleIceCandidate,
    endCall,
  } = useCallStore();
  const [isCallJoined, setIsCallJoined] = useState(false);

  const callState = window.callState;
  console.log(callState);

  useEffect(() => {
    if (!stream) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
          useCallStore.setState({ stream });
        })
        .catch((err) => console.error("Error getting media stream:", err));
    }
  }, [stream]);

  const joinCall = () => {
    if (!callState) {
      alert("Call state not found");
    } else if (!stream) {
      alert("Media stream not found");
    } else {
      setIsCallJoined(true);
      startCall(callState.callData, stream);
    }
    // Additional logic for joining the call
    // e.g., sending a WebSocket message to notify other participants
  };

  const cancelCall = () => {
    endCall();
    window.close();
  };

  useEffect(() => {
    if (peer) {
      peer.on("stream", (remoteStream) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream;
        }
      });

      // Cleanup on unmount
      return () => {
        endCall();
      };
    }
  }, [peer]);

  const handleEndCall = () => {
    endCall();
    window.close();
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="mb-4">
        <video
          ref={localVideoRef}
          autoPlay
          muted
          className="bg-black rounded-lg"
        />
        {isCallJoined && (
          <video
            ref={remoteVideoRef}
            autoPlay
            className="bg-black rounded-lg"
          />
        )}
      </div>
      {!isCallJoined && (
        <>
          <button
            onClick={joinCall}
            className="px-4 py-2 m-2 text-white bg-green-500 rounded hover:bg-green-700"
          >
            Join Call
          </button>
          <button
            onClick={cancelCall}
            className="px-4 py-2 m-2 text-white bg-gray-500 rounded hover:bg-gray-700"
          >
            Cancel
          </button>
        </>
      )}
      {isCallJoined && (
        <button
          onClick={handleEndCall}
          className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-700"
        >
          End Call
        </button>
      )}
    </div>
  );
};

export default CallPage;
