// @ts-nocheck

// Import necessary utilities from testing library
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
// Import the component to be tested
import AppointmentsPage from "./page";
// Import the store hook to be mocked
import { useAppointmentStore } from "@/store/useAppointmentStore";
// Import dayjs for date manipulation in tests if necessary
import dayjs from "dayjs";

// Mocking necessary components and store
jest.mock("@/store/useAppointmentStore");
jest.mock("@/components/appointments/appointment-card", () => ({
  __esModule: true,
  default: () => <div>AppointmentCardMock</div>,
}));
jest.mock("@/components/common/loading", () => ({
  __esModule: true,
  default: () => <div>LoadingComponentMock</div>,
}));

const mockAppointments = [
  { id: 1, date: dayjs().format("YYYY-MM-DD"), patient: { name: "John Doe" } }, // Today
  {
    id: 2,
    date: dayjs().add(1, "day").format("YYYY-MM-DD"),
    patient: { name: "Jane Doe" },
  }, // Upcoming
  {
    id: 3,
    date: dayjs().subtract(1, "day").format("YYYY-MM-DD"),
    patient: { name: "Jim Doe" },
  }, // History
];

describe("AppointmentsPage", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    useAppointmentStore.mockReturnValue({
      appointments: mockAppointments,
      fetchAppointments: jest.fn(),
    });
  });

  it("fetches appointments on component mount", async () => {
    render(<AppointmentsPage />);

    await waitFor(() =>
      expect(useAppointmentStore().fetchAppointments).toHaveBeenCalled(),
    );
  });

  it("renders loading component when appointments are fetching", () => {
    useAppointmentStore.mockImplementation(() => ({
      appointments: null,
      fetchAppointments: jest.fn(),
    }));
    render(<AppointmentsPage />);
    expect(screen.getByText("LoadingComponentMock")).toBeInTheDocument();
  });

  it("displays today's appointments", async () => {
    render(<AppointmentsPage />);
    await waitFor(() => {
      fireEvent.click(screen.getByText("Today"));
    });
    expect(screen.getByText("AppointmentCardMock")).toBeInTheDocument();
  });

  it("displays upcoming appointments", async () => {
    render(<AppointmentsPage />);
    await waitFor(() => {
      fireEvent.click(screen.getByText("Upcoming"));
    });
    expect(screen.getByText("AppointmentCardMock")).toBeInTheDocument();
  });

  it("displays history appointments", async () => {
    render(<AppointmentsPage />);
    await waitFor(() => {
      fireEvent.click(screen.getByText("History"));
    });
    expect(screen.getByText("AppointmentCardMock")).toBeInTheDocument();
  });

  it("displays all appointments", async () => {
    render(<AppointmentsPage />);
    await waitFor(() => {
      fireEvent.click(screen.getByTestId("all-tab-button"));
    });
    expect(screen.getAllByText("AppointmentCardMock")).toBeTruthy();
  });
});
