import axios from "axios";
import SimplePeer from "simple-peer";
import { act, renderHook, waitFor } from "@testing-library/react";
import { useCallStore } from "../useCallStore";

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
    // Define mock call data
    const mockCallData = { callId: "123", status: "active" };
    // Mock Axios response
    mockedAxios.get.mockResolvedValue({ data: mockCallData });

    const { result } = renderHook(() => useCallStore());
    // Render hook and call getCallData function
    act(() => {
      result.current.getCallData("123");
    });
    // Assert call data and Axios request
    await waitFor(() => {
      expect(result.current.callData).toEqual(mockCallData);
      expect(mockedAxios.get).toHaveBeenCalled();
    });
  });
  it("connects and sends message through WebSocket", () => {
    // Render hook and connect WebSocket
    const { result } = renderHook(() => useCallStore());

    act(() => {
      result.current.connectCallWebSocket("callId");
    });
    // Assert WebSocket connection and message sending
    expect(result.current.callWebSocket).toBeDefined();
    expect(result.current.callWebSocket.send).not.toHaveBeenCalled();

    // Cleanup WebSocket connection
    act(() => {
      result.current.disconnectCallWebSocket();
    });
  });

  it("initiates a call and creates a peer connection", async () => {
    // Define mock API response
    const mockApiResponse = { data: { callId: "123", status: "initiated" } };
    // Mock Axios post response
    mockedAxios.post.mockResolvedValue(mockApiResponse);

    const { result } = renderHook(() => useCallStore());
    await act(async () => {
      await result.current.initiateCall(1);
    });
    // Assert Axios post request and call data
    expect(mockedAxios.post).toHaveBeenCalled();
    expect(result.current.callData).toEqual(mockApiResponse.data);
  });
});
