import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DashboardNav } from "./dashboard-nav"; // Adjust the import path as needed
import * as AuthStore from "@/store/useAuthStore";

jest.mock("@/store/useAuthStore", () => ({
  useAuthStore: jest.fn(),
}));

describe("DashboardNav Component", () => {
  const mockUseAuthStore = AuthStore.useAuthStore;

  it("renders without crashing", () => {
    mockUseAuthStore.mockReturnValue({ user: { account_type: "patient" } });
    render(<DashboardNav />);
    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });

  it.each([
    ["patient", ["Messages", "Appointments", "Medical Records", "Profile"]],
    ["doctor", ["Messages", "Appointments", "Profile"]],
  ])("displays correct nav items for %s", (accountType, expectedLabels) => {
    mockUseAuthStore.mockReturnValue({ user: { account_type: accountType } });
    render(<DashboardNav />);
    const nav = screen.getByRole("navigation");
    expectedLabels.forEach((label) => {
      expect(within(nav).getByText(label)).toBeInTheDocument();
    });
  });

  it("has correct links for navigation items", () => {
    mockUseAuthStore.mockReturnValue({ user: { account_type: "patient" } });
    const dashboardNavItems = [
      { href: "/dashboard/messages", label: "Messages" },
      { href: "/dashboard/appointments", label: "Appointments" },
      { href: "/dashboard/medical-records", label: "Medical Records" },
      { href: "/dashboard/profile", label: "Profile" },
    ];

    render(<DashboardNav />);
    dashboardNavItems.forEach((item) => {
      expect(screen.getByText(item.label).closest("a")).toHaveAttribute(
        "href",
        item.href,
      );
    });
  });
});
