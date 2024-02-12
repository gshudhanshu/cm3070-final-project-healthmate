import React from "react";

import { useMedicalRecordsStore } from "@/store/useMedicalRecordStore";

export default function RecentDiagnosis() {
  const { medicalRecord } = useMedicalRecordsStore();

  return (
    <div>
      <h4 className="my-4 text-lg font-semibold">Recent Diagnosis</h4>
      <div className="flex flex-col gap-4">
        {medicalRecord?.diagnosis.map((diagnosis, idx) => (
          <div key={idx} className="p-4 rounded-lg bg-slate-100">
            <p className="mb-3 text-lg font-medium">
              {diagnosis.name}{" "}
              <span className="text-sm font-normal">{diagnosis.date}</span>
            </p>
            <p>
              <span className="font-medium">Details:</span>{" "}
              {diagnosis.details || "No details available"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
