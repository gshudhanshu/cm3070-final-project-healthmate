// @ts-nocheck
import { render, screen, fireEvent } from "@testing-library/react";
import { useRouter } from "next/navigation";
import { useMedicalRecordsStore } from "@/store/useMedicalRecordStore";
import AppointmentHistory from "./appointment-history";

// Mocking the useRouter hook
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// Mocking the useMedicalRecordsStore hook
jest.mock("@/store/useMedicalRecordStore", () => ({
  useMedicalRecordsStore: jest.fn(),
}));

describe("AppointmentHistory Component", () => {
  const mockPush = jest.fn();
  const mockMedicalRecordsStore = {
    medicalRecord: {
      appointments: {
        toReversed: () => [
          {
            date: "2023-01-01",
            doctor: {
              user: {
                first_name: "John",
                last_name: "Doe",
                username: "johndoe",
              },
              specialties: [{ name: "Cardiology" }],
            },
          },
        ],
      },
    },
  };

  beforeEach(() => {
    // Mock implementation for useRouter
    useRouter.mockImplementation(() => ({
      push: mockPush,
    }));

    // Mock implementation for useMedicalRecordsStore
    useMedicalRecordsStore.mockImplementation(() => mockMedicalRecordsStore);

    // Reset mocks before each test
    mockPush.mockReset();
  });

  it("renders appointment history correctly", () => {
    render(<AppointmentHistory />);
    expect(screen.getByText("Appointment History")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Cardiology")).toBeInTheDocument();
    expect(screen.getByText("2023-01-01")).toBeInTheDocument();
  });

  it('navigates to doctor\'s profile on "View Profile" button click', () => {
    render(<AppointmentHistory />);
    const viewProfileButton = screen.getAllByText("View Profile")[0];
    fireEvent.click(viewProfileButton);
    expect(mockPush).toHaveBeenCalledWith("/doctors/johndoe");
  });
});
