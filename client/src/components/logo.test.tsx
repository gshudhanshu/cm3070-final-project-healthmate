import { render, screen } from "@testing-library/react";
import Logo from "./logo"; // Adjust the import path as needed

describe("Logo Component", () => {
  it("renders without crashing", () => {
    render(<Logo />);
    expect(screen.getByTestId("logo")).toBeInTheDocument();
  });
});
