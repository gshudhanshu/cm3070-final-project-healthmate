// @ts-nocheck
import { render, screen } from "@testing-library/react";
import ProfileHeader from "./profile-header";

// Mock doctor data
const mockDoctor = {
  profile_pic: "https://example.com/profile.jpg",
  user: {
    first_name: "Jane",
    last_name: "Doe",
  },
  hospital_address: {
    city: "New York",
    state: "NY",
    country: "USA",
    postal_code: "10001",
  },
  cost: "$100",
};

describe("ProfileHeader Component", () => {
  it("displays the doctor's name, hospital address, and cost correctly", () => {
    render(<ProfileHeader doctor={mockDoctor} />);
    // Check if doctor's name is displayed correctly
    expect(
      screen.getByText(
        `Dr. ${mockDoctor.user.first_name} ${mockDoctor.user.last_name}`,
      ),
    ).toBeInTheDocument();
    // Check if hospital address is displayed correctly
    expect(
      screen.getByText(
        `${mockDoctor.hospital_address.city}, ${mockDoctor.hospital_address.state}, ${mockDoctor.hospital_address.country} ${mockDoctor.hospital_address.postal_code}`,
      ),
    ).toBeInTheDocument();
    // Check if cost is displayed correctly
    expect(screen.getByText(`Cost: ${mockDoctor.cost}`)).toBeInTheDocument();
  });

  it('renders the "Book Appointment" button', () => {
    render(<ProfileHeader doctor={mockDoctor} />);
    // Check if the "Book Appointment" button is rendered
    expect(
      screen.getByRole("button", { name: /book appointment/i }),
    ).toBeInTheDocument();
  });

  it("uses a default profile picture when none is provided", () => {
    // Create a doctor without a profile picture
    const doctorWithoutPic = { ...mockDoctor, profile_pic: undefined };
    render(<ProfileHeader doctor={doctorWithoutPic} />);
    // Check if an image element exists (indicating the default profile picture)
    const image = document.querySelector("img");
    expect(image).toBeTruthy();
  });
});
