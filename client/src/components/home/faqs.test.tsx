import { render, screen, fireEvent } from "@testing-library/react";
import Faqs from "./faqs";

describe("Faqs Component", () => {
  beforeEach(() => {
    render(<Faqs />);
  });

  it("renders without crashing", () => {
    expect(screen.getByText("Frequently Asked Questions")).toBeInTheDocument();
  });

  it("renders all FAQ questions", () => {
    const questions = screen.getAllByRole("button");
    // Check if all questions are rendered
    expect(questions).toHaveLength(10);
    expect(questions[0]).toHaveTextContent(
      "How do I sign up for Health Mate services?",
    );
  });

  it("renders all FAQ answers", () => {
    // Click on the first question to open the accordion
    fireEvent.click(screen.getAllByRole("button")[0]);
    // Check if the answer is displayed
    expect(
      screen.getByText(
        "Signing up is simple. Click the 'Sign Up' button, provide the required information, and you'll be all set to schedule your first consultation.",
      ),
    ).toBeInTheDocument();
  });

  it("toggles FAQ answer visibility when its question is clicked", () => {
    const firstQuestion = screen.getAllByRole("button")[0];
    fireEvent.click(firstQuestion);
    // Check if the answer is visible
    let firstAnswer = screen.getByText(
      "Signing up is simple. Click the 'Sign Up' button, provide the required information, and you'll be all set to schedule your first consultation.",
    );
    expect(firstAnswer).toBeVisible();
    // Click again to hide
    fireEvent.click(firstQuestion);
    // Check if the answer is hidden
    expect(firstAnswer).not.toBeVisible();
  });

  it("displays the correct number of FAQs", () => {
    // Check if all questions are rendered
    const questions = screen.getAllByRole("button");
    expect(questions).toHaveLength(10);
  });
});
