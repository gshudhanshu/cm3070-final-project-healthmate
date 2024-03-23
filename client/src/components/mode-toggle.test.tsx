import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ModeToggle } from "./mode-toggle"; // Adjust the import path as necessary.
import { useTheme } from "next-themes";
import userEvent from "@testing-library/user-event";

// Mock `useTheme` hook
jest.mock("next-themes", () => ({
  useTheme: jest.fn(),
}));

describe("ModeToggle Component", () => {
  it("toggles theme from light to dark", async () => {
    // Provide a mock implementation for useTheme
    const setTheme = jest.fn();
    useTheme.mockImplementation(() => ({
      setTheme,
      theme: "light",
    }));

    render(<ModeToggle />);

    // Simulate clicking on the dropdown to change theme to "dark"
    await userEvent.click(screen.getByRole("button"));
    await userEvent.click(screen.getByText("Dark"));

    // Assert `setTheme` was called with "dark"
    expect(setTheme).toHaveBeenCalledWith("dark");
  });

  it("toggles theme from dark to light", async () => {
    // Provide a mock implementation for useTheme
    const setTheme = jest.fn();
    useTheme.mockImplementation(() => ({
      setTheme,
      theme: "dark",
    }));

    render(<ModeToggle />);

    // Simulate clicking on the dropdown to change theme to "light"
    await userEvent.click(screen.getByRole("button"));
    await userEvent.click(screen.getByText("Light"));

    // Assert `setTheme` was called with "light"
    expect(setTheme).toHaveBeenCalledWith("light");
  });

  it("sets theme to system", async () => {
    // Mock implementation for `useTheme` with initial "light" or "dark" theme
    const setTheme = jest.fn();
    useTheme.mockImplementation(() => ({
      setTheme,
      theme: "light", // or "dark"
    }));

    render(<ModeToggle />);

    // Simulate clicking on the dropdown to change theme to "system"
    await userEvent.click(screen.getByRole("button"));
    await userEvent.click(screen.getByText("System"));

    // Assert `setTheme` was called with "system"
    expect(setTheme).toHaveBeenCalledWith("system");
  });
});
