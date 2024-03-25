// @ts-nocheck
import React from "react";
import { render, waitFor } from "@testing-library/react";
import Page from "./page";
import { useMedicalRecordsStore } from "@/store/useMedicalRecordStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useMessagesStore } from "@/store/useMessageStore";

// Mocking store hooks and components
jest.mock("@/store/useMedicalRecordStore", () => ({
  useMedicalRecordsStore: jest.fn(),
}));
jest.mock("@/store/useAuthStore", () => ({
  useAuthStore: jest.fn(),
}));
jest.mock("@/store/useMessageStore", () => ({
  useMessagesStore: jest.fn(),
}));
jest.mock("@/components/medical-records/personal-details", () => (
  <div>PersonalDetails</div>
));
jest.mock("@/components/medical-records/active-medicines", () => (
  <div>ActiveMedicines</div>
));
jest.mock("@/components/medical-records/recent-diagnosis", () => (
  <div>RecentDiagnosis</div>
));
jest.mock("@/components/medical-records/appointment-history", () => (
  <div>AppointmentHistory</div>
));

// Mock implementations
const mockFetchMedicalRecords = jest.fn();

useMedicalRecordsStore.mockReturnValue({
  fetchMedicalRecords: mockFetchMedicalRecords,
  medicalRecord: null,
});

useAuthStore.mockReturnValue({
  user: { username: "testUser" },
});

useMessagesStore.mockReturnValue({
  selectedConversation: {
    patient: { username: "patientUser" },
    id: "123",
  },
});

describe("Page Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("fetches medical records on mount for a patient", async () => {
    render(<Page isDoctorFetching={true} />);

    await waitFor(() =>
      expect(mockFetchMedicalRecords).toHaveBeenCalledWith(
        "patientUser",
        "123",
      ),
    );
  });

  it("fetches medical records on mount for the logged-in user", async () => {
    render(<Page />);

    await waitFor(() =>
      expect(mockFetchMedicalRecords).toHaveBeenCalledWith("testUser"),
    );
  });

  it("displays loading component when medical records are not available", () => {
    const { getByText } = render(<Page />);
    expect(getByText("Loading...")).toBeInTheDocument();
  });

  it("displays no results found when medical records are empty", () => {
    useMedicalRecordsStore.mockImplementation(() => ({
      fetchMedicalRecords: mockFetchMedicalRecords,
      medicalRecord: {},
    }));

    const { getByText } = render(<Page />);
    expect(getByText("No results found!")).toBeInTheDocument();
  });
});
