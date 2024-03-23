import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import IncomingCallDrawer from "./incoming-call-drawer"; // Adjust the import path as needed

describe("IncomingCallDrawer Component", () => {
  beforeEach(() => {
    render(<IncomingCallDrawer />);
  });

  it("opens and closes the drawer", async () => {
    // Assuming there's a way to detect if the drawer is open or closed.
    // This might depend on the implementation details of the Drawer component.
    const openButton = screen.getByText("Open Incoming Call");
    await userEvent.click(openButton);
    // Verify drawer opened (e.g., by checking for the presence of content that should now be visible)
    expect(screen.getByText(/John Doe is calling.../i)).toBeInTheDocument();

    const closeButton = screen.getByRole("button", { name: "" }); // Adjust based on actual aria-label or texts
    userEvent.click(closeButton);
    // Verify drawer closed. This may need to check for absence of certain elements or changes in style/class.
  });

  it("displays the drawer content correctly", async () => {
    const openButton = screen.getByText("Open Incoming Call");
    await userEvent.click(openButton);

    expect(screen.getByText("Incoming Call")).toBeInTheDocument();
    expect(screen.getByText("John Doe is calling...")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Accept/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Decline/i }),
    ).toBeInTheDocument();
  });

  // Note: Testing actual Accept/Decline actions might require mocking external handlers
  // if those actions are passed as props or rely on global state/context.
});
