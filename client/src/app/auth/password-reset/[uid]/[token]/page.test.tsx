import React from "react";
import { render, screen } from "@testing-library/react";
import Page from "./page";

// Mocking the ForgetForm component
jest.mock("@/components/auth/password-reset-form", () => ({
  __esModule: true,
  default: () => <div>PasswordResetConfirmMock</div>,
}));

describe("Page Component", () => {
  it("renders the login form and the hero image", () => {
    render(<Page />);
    expect(screen.getByText("PasswordResetConfirmMock")).toBeTruthy();
    // Check for the hero image using the alt text
    expect(screen.getByAltText("hero")).toBeTruthy();
  });
});
