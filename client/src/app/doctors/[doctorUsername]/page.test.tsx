// @ts-nocheck
// Import necessary testing utilities
import React from "react";
import { render, screen } from "@testing-library/react";
import Page from "./page"; // Adjust the import path according to your project structure
import { useUserProfileStore } from "@/store/useUserProfileStore";

// Mock the store
jest.mock("@/store/useUserProfileStore");

// Optional: Mock next/navigation if used within child components
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
  useSearchParams: jest.fn(),
}));

describe("Doctor Profile Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useUserProfileStore.mockReturnValue({
      isLoading: false,
      error: { message: "An error occurred" },
      fetchDoctorProfile: jest.fn(),
      doctorProfile: {
        username: "doctoruser",
        description: "Test Description",
        // Include other necessary mock data for the profile
      },
    });
  });
  it("displays the loading component when isLoading is true", () => {
    useUserProfileStore.mockReturnValue({
      isLoading: true,
      error: null,
      fetchDoctorProfile: jest.fn(),
      doctorProfile: null,
    });
    render(<Page params={{ doctorUsername: "doctoruser" }} />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("displays the error component when there is an error", () => {
    render(<Page params={{ doctorUsername: "doctoruser" }} />);
    expect(screen.getByText(/an error occurred/i)).toBeInTheDocument();
  });
});
