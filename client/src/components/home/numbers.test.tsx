import { render, screen } from "@testing-library/react";
import Numbers from "./numbers";

describe("Numbers Component", () => {
  beforeEach(() => {
    render(<Numbers />);
  });

  it("renders without crashing", () => {
    expect(
      screen.getByText("Empowering Your Health Journey"),
    ).toBeInTheDocument();
  });

  it("displays all statistics names and numbers correctly", () => {
    // Test for statistic names
    expect(screen.getByText("Patients Reached")).toBeInTheDocument();
    expect(screen.getByText("Cost Savings")).toBeInTheDocument();
    expect(screen.getByText("Hours Available")).toBeInTheDocument();
    expect(screen.getByText("Healthcare Providers")).toBeInTheDocument();

    // Test for statistic numbers
    expect(screen.getByText("1000+")).toBeInTheDocument();
    expect(screen.getByText("$10M")).toBeInTheDocument();
    expect(screen.getByText("24/7")).toBeInTheDocument();
    expect(screen.getByText("100+")).toBeInTheDocument();
  });

  it("renders the correct number of statistics", () => {
    const statisticsNumbers = screen.getAllByText(/1000\+|\$10M|24\/7|100\+/);
    // Check if all statistics numbers are rendered
    expect(statisticsNumbers).toHaveLength(4);

    const statisticsNames = screen.getAllByText(
      /Patients Reached|Cost Savings|Hours Available|Healthcare Providers/,
    );
    // Check if all statistics names are rendered
    expect(statisticsNames).toHaveLength(4);
  });
});
