export {};

declare global {
  interface Window {
    initializeCall: (
      participantUsername: string,
      callType: "audio" | "video",
    ) => void;
    callState?: any;
    stream?: MediaStream;
  }
}
