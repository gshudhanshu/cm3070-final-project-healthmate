import React from "react";
import { render, screen } from "@testing-library/react";
import Page from "./page"; // Adjust the import path as necessary
import LoginForm from "@/components/auth/login-form";

// Optionally, if you need to mock LoginForm due to external dependencies
jest.mock("@/components/auth/login-form", () => ({
  __esModule: true,
  default: () => <div>LoginFormMock</div>,
}));

describe("Page Component", () => {
  it("renders the login form and the hero image", () => {
    render(<Page />);
    expect(screen.getByText("LoginFormMock")).toBeTruthy();
    // Check for the hero image using the alt text
    expect(screen.getByAltText("hero")).toBeTruthy();
  });
});
