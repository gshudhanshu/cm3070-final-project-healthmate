// @ts-nocheck

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AppointmentsPage from "./page";
import { useAppointmentStore } from "@/store/useAppointmentStore";
import dayjs from "dayjs";

// Mocking the AppointmentCard component
jest.mock("@/store/useAppointmentStore");
jest.mock("@/components/appointments/appointment-card", () => ({
  __esModule: true,
  default: () => <div>AppointmentCardMock</div>,
}));
// Mocking the Loading component
jest.mock("@/components/common/loading", () => ({
  __esModule: true,
  default: () => <div>LoadingComponentMock</div>,
}));

const mockAppointments = [
  // Today
  { id: 1, date: dayjs().format("YYYY-MM-DD"), patient: { name: "John Doe" } },
  // Upcoming
  {
    id: 2,
    date: dayjs().add(1, "day").format("YYYY-MM-DD"),
    patient: { name: "Jane Doe" },
  },
  // History
  {
    id: 3,
    date: dayjs().subtract(1, "day").format("YYYY-MM-DD"),
    patient: { name: "Jim Doe" },
  },
];

describe("AppointmentsPage", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    // Mocking the behavior of useAppointmentStore hook
    useAppointmentStore.mockReturnValue({
      appointments: mockAppointments,
      fetchAppointments: jest.fn(),
    });
  });

  it("fetches appointments on component mount", async () => {
    render(<AppointmentsPage />);
    // Wait for the component to render
    await waitFor(() =>
      expect(useAppointmentStore().fetchAppointments).toHaveBeenCalled(),
    );
  });

  it("renders loading component when appointments are fetching", () => {
    // Mocking the appointments data to be null, indicating fetching
    useAppointmentStore.mockImplementation(() => ({
      appointments: null,
      fetchAppointments: jest.fn(),
    }));
    render(<AppointmentsPage />);
    // Assertion for presence of loading component
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
