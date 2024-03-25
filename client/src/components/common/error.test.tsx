import { render, screen, fireEvent } from "@testing-library/react";
import ErrorComponent from "./error";

describe("ErrorComponent", () => {
  it("displays the default error message when no message is provided", () => {
    render(<ErrorComponent />);
    expect(
      screen.getByText(/an error occurred. please try again./i),
    ).toBeInTheDocument();
  });

  it("displays a custom message when one is provided", () => {
    const customMessage = "Something went wrong. Please refresh the page.";
    render(<ErrorComponent message={customMessage} />);
    expect(screen.getByText(customMessage)).toBeInTheDocument();
  });

  it('renders the "Retry" button and triggers onRetry when clicked', () => {
    const onRetryMock = jest.fn();
    render(<ErrorComponent onRetry={onRetryMock} />);

    const retryButton = screen.getByRole("button", { name: /retry/i });
    expect(retryButton).toBeInTheDocument();

    fireEvent.click(retryButton);
    expect(onRetryMock).toHaveBeenCalledTimes(1);
  });

  it('does not render the "Retry" button when no onRetry function is provided', () => {
    render(<ErrorComponent />);
    expect(screen.queryByRole("button", { name: /retry/i })).toBeNull();
  });
});
