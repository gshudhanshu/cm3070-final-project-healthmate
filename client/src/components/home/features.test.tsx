import { render, screen } from "@testing-library/react";
import Features from "./features"; // Adjust the import path as needed

describe("Features Component", () => {
  beforeEach(() => {
    render(<Features />);
  });

  it("renders without crashing", () => {
    expect(
      screen.getByText("Empowering Your Health Journey"),
    ).toBeInTheDocument();
  });

  it("displays feature names and descriptions", () => {
    // Test for feature names
    expect(
      screen.getByText("Instant Medical Consultations"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Comprehensive Health Services"),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Immediate access to doctors and healthcare advice with just one click.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "From primary care to chronic disease management, we cover all your health needs.",
      ),
    ).toBeInTheDocument();
  });
});
