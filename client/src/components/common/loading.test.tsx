import { render, screen } from "@testing-library/react";
import LoadingComponent from "./loading"; // Adjust the import path as needed

describe("LoadingComponent", () => {
  it("renders the loading message", () => {
    render(<LoadingComponent />);
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });
});
