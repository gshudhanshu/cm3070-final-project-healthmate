// @ts-nocheck
import { render, screen } from "@testing-library/react";
import React from "react";
import ActiveMedicines from "./active-medicines";
import { useMedicalRecordsStore } from "@/store/useMedicalRecordStore";

jest.mock("@/store/useMedicalRecordStore");

// Mocking the store
useMedicalRecordsStore.mockImplementation(() => ({
  medicalRecord: {
    medicines: {
      toReversed: () => [
        {
          name: "Medicine A 100mg",
          dosage: "2 times a day",
          start_date: "2023-01-01",
          end_date: "2023-12-31",
        },
        {
          name: "Medicine B 200mg",
          dosage: "2 times a day",
          start_date: "2023-02-01",
          end_date: "2023-12-31",
        },
      ],
    },
  },
}));

describe("ActiveMedicines Component", () => {
  it("renders the list of active medicines", () => {
    render(<ActiveMedicines />);
    expect(screen.getByText("Medicine A 100mg")).toBeInTheDocument();
    expect(screen.getByText("Medicine B 200mg")).toBeInTheDocument();
  });

  it("handles an empty list of medicines appropriately", () => {
    useMedicalRecordsStore.mockImplementation(() => ({
      medicalRecord: {
        medicines: {
          toReversed: () => [],
        },
      },
    }));

    render(<ActiveMedicines />);
    expect(screen.queryByText("Dosage:")).not.toBeInTheDocument();
  });
});
