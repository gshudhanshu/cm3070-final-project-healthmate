// @ts-nocheck
import { render, screen, fireEvent, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AppointmentModal from "./appointments-modal"; // Adjust import path as needed
import * as findDocStore from "@/store/useFindDocStore"; // Adjust import path as needed
import dayjs from "dayjs";

jest.mock("@/store/useFindDocStore"); // Mock the useFindDocStore hook

const mockDoctorSlots = {
  user: { username: "johndoe", first_name: "John", last_name: "Doe" },
  appointment_slots: [
    {
      datetime_utc: dayjs().add(1, "day").format(),
      status: "available",
      time: "10:00 AM",
    },
  ],
  cost: "100",
  currency: "USD",
  specialties: [{ name: "General Practice" }],
};

const mockDoctor = {
  user: {
    username: "johndoe",
  },
};

describe("AppointmentModal", () => {
  beforeEach(() => {
    findDocStore.useFindDocStore.mockReturnValue({
      fetchDoctorWithSlots: jest.fn().mockResolvedValue(mockDoctorSlots),
      doctorSlots: mockDoctorSlots,
      bookAppointment: jest.fn(),
      purpose: "",
      isLoading: false,
    });
  });

  it("loads and displays available slots correctly", async () => {
    render(<AppointmentModal isModalOpen={true} closeModal={jest.fn()} />);
    const slotButton = await screen.findAllByTestId("slot-button");
    expect(slotButton).toBeTruthy();
  });

  it("shows loading component when fetching slots", () => {
    findDocStore.useFindDocStore.mockImplementation(() => ({
      isLoading: true,
      error: null,
      reviews: [],
      fetchDoctorWithSlots: jest.fn(),
    }));

    render(<AppointmentModal isModalOpen={true} closeModal={jest.fn()} />);
    expect(screen.getByText(/loading.../i)).toBeInTheDocument();
  });
});
