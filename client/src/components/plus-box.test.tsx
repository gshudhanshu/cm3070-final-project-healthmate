import { render, screen } from "@testing-library/react";
import PlusBox from "./plus-box";

describe("PlusBox Component", () => {
  it("renders without crashing", () => {
    render(<PlusBox />);
    expect(screen.getByTestId("plus-box")).toBeInTheDocument();
  });
});
