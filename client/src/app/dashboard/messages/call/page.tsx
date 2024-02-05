"use client";

import React, { useEffect, useRef } from "react";
import SimplePeer from "simple-peer";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallStore } from "@/store/useCallStore";

const CallPage = () => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const searchParams = useSearchParams();
  const participant = searchParams.get("participant");
  const type = searchParams.get("type");

  useEffect(() => {
    const callState = window.callState;
    if (callState && callState.stream && localVideoRef.current) {
      localVideoRef.current.srcObject = callState.stream;

      // Cleanup on unmount
      return () => {
        callState.endCall();
      };
    }
  }, []);

  const handleEndCall = () => {
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
        <video ref={remoteVideoRef} autoPlay className="bg-black rounded-lg" />
      </div>
      <button
        onClick={handleEndCall}
        className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-700"
      >
        End Call
      </button>
    </div>
  );
};

export default CallPage;
