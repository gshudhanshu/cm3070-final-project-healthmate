import { render, screen } from "@testing-library/react";
import PlusBox from "./plus-box"; // Adjust the import path as needed

describe("PlusBox Component", () => {
  it("renders without crashing", () => {
    render(<PlusBox />);
    expect(screen.getByTestId("plus-box")).toBeInTheDocument();
  });
});
