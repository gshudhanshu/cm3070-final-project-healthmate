// First, mock external modules such as axios and the toast component
jest.mock("axios");
jest.mock("@/components/ui/use-toast", () => ({
  toast: jest.fn(),
}));

// // Mocking environment variables
// process.env.API_URL = "https://api.example.com";

import axios from "axios";
import { act, renderHook, waitFor } from "@testing-library/react";
import { useFindDocStore } from "../useFindDocStore"; // Adjust this import to the correct path
import { toast } from "@/components/ui/use-toast";

// Helper to reset all mocks between tests
beforeEach(() => {
  jest.clearAllMocks();
});

describe("useFindDocStore", () => {
  it("should update doctors and pagination on successful search", async () => {
    const mockedAxios = axios as jest.Mocked<typeof axios>;
    mockedAxios.get.mockResolvedValue({
      data: {
        results: [{ id: 1, name: "Dr. Test" }],
        count: 1,
        next_page: 0,
        previous_page: 0,
        current_page: 1,
        total_pages: 1,
      },
    });

    const { result } = renderHook(() => useFindDocStore());
    act(() => {
      result.current.searchDoctors();
    });

    await waitFor(() => {
      expect(result.current.doctors).toEqual([{ id: 1, name: "Dr. Test" }]);
      expect(result.current.pagination.count).toBe(1);
    });
  });

  it("should update searchParams correctly", () => {
    const { result } = renderHook(() => useFindDocStore());
    act(() => {
      result.current.setSearchParams({ specialty: "dentist" });
    });

    expect(result.current.searchParams.specialty).toBe("dentist");
  });

  it("fetchDoctorWithSlots updates doctorSlots on success", async () => {
    const mockedAxios = axios as jest.Mocked<typeof axios>;
    mockedAxios.get.mockResolvedValue({
      data: { id: 1, slots: ["2023-03-25T10:00:00Z"] },
    });

    const { result } = renderHook(() => useFindDocStore());
    act(() => {
      result.current.fetchDoctorWithSlots("drtest", "2023-03-25", "UTC");
    });

    await waitFor(() => {
      expect(result.current.doctorSlots).toEqual({
        id: 1,
        slots: ["2023-03-25T10:00:00Z"],
      });
    });
  });

  it("bookAppointment handles success correctly", async () => {
    const mockedAxios = axios as jest.Mocked<typeof axios>;
    mockedAxios.post.mockResolvedValue({
      status: 201,
      data: { appointmentId: "123" },
    });

    const { result } = renderHook(() => useFindDocStore());
    act(() => {
      result.current.bookAppointment(
        "drtest",
        "2023-03-25T10:00:00Z",
        "Checkup",
      );
    });

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith({
        title: "Appointment booked successfully",
        description: "Please come on time for your appointment.",
      });
    });
  });
});
