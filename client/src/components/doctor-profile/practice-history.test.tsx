import { render, screen } from "@testing-library/react";
import PracticeHistory from "./practice-history";

describe("PracticeHistory Component", () => {
  it("renders without crashing", () => {
    render(<PracticeHistory />);
    expect(
      screen.getByText("Telemedicine Practice History"),
    ).toBeInTheDocument();
  });

  it("displays the correct number of reviews and their details", () => {
    render(<PracticeHistory />);
    const reviews = screen.getAllByText(/Lorem ipsum dolor sit amet.../i);
    // Expects one review with the provided text
    expect(reviews).toHaveLength(1);

    const rating = screen.getAllByTestId("star-icon");
    // Checks for 5 stars in total
    expect(rating).toHaveLength(5);
  });

  it('renders the "Load More" button', () => {
    render(<PracticeHistory />);
    expect(
      screen.getByRole("button", { name: /load more/i }),
    ).toBeInTheDocument();
  });
});
