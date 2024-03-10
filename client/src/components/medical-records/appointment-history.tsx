"use client";

import React from "react";
import { useMedicalRecordsStore } from "@/store/useMedicalRecordStore";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

export default function AppointmentHistory() {
  const { medicalRecord } = useMedicalRecordsStore();
  const router = useRouter();
  const handleViewProfile = (username: string) => {
    router.push(`/doctors/${username}`);
  };

  return (
    <div>
      <h4 className="my-4 text-lg font-semibold">Appointment History</h4>
      <div className="flex flex-col gap-4">
        {medicalRecord?.appointments.toReversed().map((appointment, idx) => (
          <div
            key={idx}
            className="flex flex-col gap-2 rounded-lg bg-slate-100 p-4"
          >
            <p className="text-md font-medium">
              <span key={idx} className="mr-1">
                {appointment.doctor.specialties
                  ?.map((specialty, idx) => specialty.name)
                  .join(", ") || "No specialty available"}
              </span>
            </p>
            <p>
              {appointment.doctor.user.first_name}{" "}
              {appointment.doctor.user.last_name}
            </p>
            <p>
              <span className="font-medium">Date:</span> {appointment.date}
            </p>
            <Button
              className="w-32"
              onClick={() =>
                handleViewProfile(appointment.doctor.user.username)
              }
            >
              View Profile
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
