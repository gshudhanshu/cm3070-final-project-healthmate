import axios from "axios";
import SimplePeer from "simple-peer";
import { act, renderHook, waitFor } from "@testing-library/react";
import { useCallStore } from "../useCallStore"; // Adjust the import path

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock WebSocket
class WebSocketMock {
  send = jest.fn();
  close = jest.fn();
  // Simulate invoking onmessage with mock data
  onmessage = jest.fn();
  onopen = jest.fn();
  onclose = jest.fn();
}

global.WebSocket = WebSocketMock as any;

// Mock SimplePeer
jest.mock("simple-peer", () => {
  return jest.fn().mockImplementation(() => ({
    on: jest.fn((event, callback) => {
      if (event === "signal") {
        callback("mocked signal");
      }
      if (event === "stream") {
        callback(new MediaStream());
      }
    }),
    signal: jest.fn(),
    destroy: jest.fn(),
  }));
});

describe("useCallStore", () => {
  it("successfully fetches and stores call data", async () => {
    const mockCallData = { callId: "123", status: "active" };
    mockedAxios.get.mockResolvedValue({ data: mockCallData });

    const { result } = renderHook(() => useCallStore());

    act(() => {
      result.current.getCallData("123");
    });

    await waitFor(() => {
      expect(result.current.callData).toEqual(mockCallData);
      expect(mockedAxios.get).toHaveBeenCalled();
    });
  });
  it("connects and sends message through WebSocket", () => {
    const { result } = renderHook(() => useCallStore());

    act(() => {
      result.current.connectCallWebSocket("callId");
    });

    expect(result.current.callWebSocket).toBeDefined();
    expect(result.current.callWebSocket.send).not.toHaveBeenCalled(); // Assuming no immediate message is sent on connection

    // Cleanup
    act(() => {
      result.current.disconnectCallWebSocket();
    });
  });

  it("initiates a call and creates a peer connection", async () => {
    const mockApiResponse = { data: { callId: "123", status: "initiated" } };
    mockedAxios.post.mockResolvedValue(mockApiResponse);

    const { result } = renderHook(() => useCallStore());
    await act(async () => {
      await result.current.initiateCall(1);
    });

    expect(mockedAxios.post).toHaveBeenCalled();
    expect(result.current.callData).toEqual(mockApiResponse.data);
  });
});
