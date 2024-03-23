import { render, screen, fireEvent } from "@testing-library/react";
import Faqs from "./faqs"; // Adjust the import path as needed

describe("Faqs Component", () => {
  beforeEach(() => {
    render(<Faqs />);
  });

  it("renders without crashing", () => {
    expect(screen.getByText("Frequently Asked Questions")).toBeInTheDocument();
  });

  it("renders all FAQ questions", () => {
    const questions = screen.getAllByRole("button");
    expect(questions).toHaveLength(10); // Adjust based on the number of FAQs
    expect(questions[0]).toHaveTextContent(
      "How do I sign up for Health Mate services?",
    );
    // Add more assertions as needed for other questions
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
    // Repeat for other FAQs as needed
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
    // Now the answer should not be visible; this might need a more specific query or assumption about how the visibility is toggled
    expect(firstAnswer).not.toBeVisible(); // This assertion depends on how your accordion hides content (e.g., removing from DOM or changing visibility)
  });

  it("displays the correct number of FAQs", () => {
    // This checks for the accordion triggers since each question should have one
    const questions = screen.getAllByRole("button");
    expect(questions).toHaveLength(10);
  });
});
