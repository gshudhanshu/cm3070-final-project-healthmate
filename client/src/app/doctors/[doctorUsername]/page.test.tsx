// @ts-nocheck
import React from "react";
import { render, screen } from "@testing-library/react";
import Page from "./page";
import { useUserProfileStore } from "@/store/useUserProfileStore";

// Mock the store
jest.mock("@/store/useUserProfileStore");

//Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
  useSearchParams: jest.fn(),
}));

describe("Doctor Profile Page", () => {
  beforeEach(() => {
    // Reset the mocks
    jest.clearAllMocks();
    // Mock the store to return a doctor profile
    useUserProfileStore.mockReturnValue({
      isLoading: false,
      error: { message: "An error occurred" },
      fetchDoctorProfile: jest.fn(),
      doctorProfile: {
        username: "doctoruser",
        description: "Test Description",
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
