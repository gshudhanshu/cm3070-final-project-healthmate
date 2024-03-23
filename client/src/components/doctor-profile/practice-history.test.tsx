import { render, screen } from "@testing-library/react";
import PracticeHistory from "./practice-history"; // Adjust the import path as needed

describe("PracticeHistory Component", () => {
  it("renders without crashing", () => {
    render(<PracticeHistory />);
    expect(
      screen.getByText("Telemedicine Practice History"),
    ).toBeInTheDocument();
  });

  it("displays the correct number of reviews and their details", () => {
    render(<PracticeHistory />);
    // Assuming there's only one review in the initial setup
    const reviews = screen.getAllByText(/Lorem ipsum dolor sit amet.../i);
    expect(reviews).toHaveLength(1); // Adjust according to the actual number of initial reviews

    const rating = screen.getAllByTestId("star-icon");
    expect(rating).toHaveLength(5); // Checks for 5 stars in total, adjust if your logic for displaying stars differs
  });

  it('renders the "Load More" button', () => {
    render(<PracticeHistory />);
    expect(
      screen.getByRole("button", { name: /load more/i }),
    ).toBeInTheDocument();
  });
});
