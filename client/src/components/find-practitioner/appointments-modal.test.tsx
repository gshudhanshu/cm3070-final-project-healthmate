// @ts-nocheck
import { render, screen, fireEvent, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AppointmentModal from "./appointments-modal";
import * as findDocStore from "@/store/useFindDocStore";
import dayjs from "dayjs";

// Mock the useFindDocStore hook
jest.mock("@/store/useFindDocStore");

// Mock the doctor slots object
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

// Mock the doctor object
const mockDoctor = {
  user: {
    username: "johndoe",
  },
};

describe("AppointmentModal", () => {
  // Mock the useFindDocStore hook to return the mock doctor slots
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
    // Mock the useFindDocStore hook to return loading state
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
