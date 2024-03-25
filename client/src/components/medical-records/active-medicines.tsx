import React from "react";
import { useMedicalRecordsStore } from "@/store/useMedicalRecordStore";

export default function ActiveMedicines() {
  const { medicalRecord } = useMedicalRecordsStore();
  return (
    <div>
      <h4 className="my-4 text-lg font-semibold">Active Medicines</h4>
      <div className="flex flex-col gap-4">
        {medicalRecord?.medicines.toReversed().map((medicine, idx) => (
          <div
            key={idx}
            className="rounded-lg bg-slate-100 p-4 dark:bg-slate-800"
          >
            <p className="mb-3 text-lg font-medium">{medicine?.name || ""}</p>
            <p>
              <span className="font-medium">Dosage:</span>{" "}
              {medicine?.dosage || ""}
            </p>
            <p>
              <span className="font-medium">Start Date:</span>{" "}
              {medicine?.start_date || ""}
            </p>
            <p>
              <span className="font-medium">End Date:</span>{" "}
              {medicine?.end_date || ""}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
