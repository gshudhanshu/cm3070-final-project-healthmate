// @ts-nocheck
// Import necessary testing utilities and the component to be tested
import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Page from "./page"; // Adjust the import path based on your project structure
import * as authStore from "@/store/useAuthStore";

// Mock the useAuthStore hook
jest.mock("@/store/useAuthStore", () => ({
  useAuthStore: jest.fn(),
}));

describe("Page Component", () => {
  it("renders DoctorProfileForm for doctor users", () => {
    // Mock user as a doctor
    authStore.useAuthStore.mockReturnValue({
      user: { account_type: "doctor" },
    });

    render(<Page />);

    expect(screen.getByTestId("doctor-profile-form")).toBeInTheDocument();
    expect(
      screen.queryByTestId("patient-profile-form"),
    ).not.toBeInTheDocument();
  });

  it("renders PatientProfileForm for patient users", () => {
    // Mock user as a patient
    authStore.useAuthStore.mockReturnValue({
      user: { account_type: "patient" },
    });

    render(<Page />);

    expect(screen.getByTestId("patient-profile-form")).toBeInTheDocument();
    expect(screen.queryByTestId("doctor-profile-form")).not.toBeInTheDocument();
  });
});
