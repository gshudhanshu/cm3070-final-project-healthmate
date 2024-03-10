import { renderHook, act } from "@testing-library/react";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import { useAppointmentStore } from "../useAppointmentStore";
import { useAuthStore } from "../useAuthStore";

const API_URL = process.env.API_URL;
const APPOINTMENTS_URL = `${API_URL}/appointments/`;
const mockAppointments = [
  { id: 1, title: "Appointment 1", date: "2023-01-01" },
  { id: 2, title: "Appointment 2", date: "2023-01-02" },
];

describe("useAppointmentStore", () => {
  let mockAxios: any;

  beforeAll(() => {
    // Setup axios mock
    mockAxios = new MockAdapter(axios);
    // Mock the useAuthStore to return a token
    useAuthStore.setState({ token: "test-token" });
  });

  afterEach(() => {
    mockAxios.reset();
    useAppointmentStore.setState({ appointments: null });
  });

  it("fetchAppointments should fetch and set appointments", async () => {
    // Mocking the GET request to APPOINTMENTS_URL
    mockAxios.onGet(APPOINTMENTS_URL).reply(200, mockAppointments);

    const { result } = renderHook(() => useAppointmentStore());

    await act(async () => {
      await result.current.fetchAppointments();
    });

    // Check if the appointments were fetched and set correctly
    expect(result.current.appointments).toEqual(mockAppointments);
  });
});
