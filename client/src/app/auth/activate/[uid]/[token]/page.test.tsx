// @ts-nocheck
import React from "react";
import { render, waitFor, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import axios from "axios";
import ActivateAccount from "./page";

// Mocking axios
jest.mock("axios");

describe("ActivateAccount Component", () => {
  // Setup mock data for uid and token
  const mockParams = { uid: "test-uid", token: "test-token" };

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it("should make an API call to activate account on component mount", async () => {
    // Mock axios post request to resolve successfully
    axios.post.mockResolvedValue({ data: "Activation successful" });

    render(<ActivateAccount params={mockParams} />);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        `${process.env.API_URL}/auth/users/activation/`,
        mockParams,
      );
    });
  });

  it("renders activation message", () => {
    render(<ActivateAccount params={mockParams} />);
    expect(screen.getByText(/Account is activated/i)).toBeInTheDocument();
  });
});
