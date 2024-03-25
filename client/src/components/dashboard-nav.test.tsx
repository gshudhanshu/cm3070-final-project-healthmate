// @ts-nocheck
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DashboardNav } from "./dashboard-nav";
import * as AuthStore from "@/store/useAuthStore";

// Mock useAuthStore hook
jest.mock("@/store/useAuthStore", () => ({
  useAuthStore: jest.fn(),
}));

describe("DashboardNav Component", () => {
  const mockUseAuthStore = AuthStore.useAuthStore;

  it("renders without crashing", () => {
    // Mock the return value of useAuthStore hook for a patient user
    mockUseAuthStore.mockReturnValue({ user: { account_type: "patient" } });
    render(<DashboardNav />);
    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });

  it.each([
    ["patient", ["Messages", "Appointments", "Medical Records", "Profile"]],
    ["doctor", ["Messages", "Appointments", "Profile"]],
  ])("displays correct nav items for %s", (accountType, expectedLabels) => {
    // Mock the return value of useAuthStore hook for a specific account type
    mockUseAuthStore.mockReturnValue({ user: { account_type: accountType } });
    render(<DashboardNav />);
    // Get the navigation role from the document
    const nav = screen.getByRole("navigation");
    // Expect each expected label to be present within the navigation role
    expectedLabels.forEach((label) => {
      expect(within(nav).getByText(label)).toBeInTheDocument();
    });
  });

  it("has correct links for navigation items", () => {
    // Mock the return value of useAuthStore hook for a patient user
    mockUseAuthStore.mockReturnValue({ user: { account_type: "patient" } });
    // Define navigation items with their respective href attributes
    const dashboardNavItems = [
      { href: "/dashboard/messages", label: "Messages" },
      { href: "/dashboard/appointments", label: "Appointments" },
      { href: "/dashboard/medical-records", label: "Medical Records" },
      { href: "/dashboard/profile", label: "Profile" },
    ];

    render(<DashboardNav />);
    // Expect each navigation item to have the correct href attribute
    dashboardNavItems.forEach((item) => {
      expect(screen.getByText(item.label).closest("a")).toHaveAttribute(
        "href",
        item.href,
      );
    });
  });
});
