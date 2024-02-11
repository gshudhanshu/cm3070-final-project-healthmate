import React from "react";
import { Badge } from "@/components/ui/badge";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useMedicalRecordsStore } from "@/store/useMedicalRecordStore";

export default function PersonalDetails({ className }: { className?: string }) {
  const { medicalRecord } = useMedicalRecordsStore();

  console.log(medicalRecord);
  if (!medicalRecord) return null;
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div>
        <h4 className="text-lg font-semibold">Personal Information</h4>
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
          <div>
            <p>
              <span className="font-semibold">Name:</span>
              {medicalRecord.patient.user.first_name}{" "}
              {medicalRecord.patient.user.last_name}
            </p>
            <p>
              <span className="font-semibold">Date of Birth:</span>{" "}
              {medicalRecord.patient.dob}
            </p>
            <p>
              <span className="font-semibold">Blood Group:</span>{" "}
              {medicalRecord.patient.blood_group}
            </p>
            <p>
              <span className="font-semibold">Marital Status:</span>{" "}
              {medicalRecord.patient.marital_status}
            </p>
          </div>
          <div>
            <p>
              <span className="font-semibold">Email:</span>{" "}
              {medicalRecord.patient.user.email}
            </p>
            <p>
              <span className="font-semibold">Mobile:</span>{" "}
              {medicalRecord.patient.phone}
            </p>
            <p>
              <span className="font-semibold">Location:</span>{" "}
              {medicalRecord.patient.address.city}{" "}
              {medicalRecord.patient.address.state}{" "}
              {medicalRecord.patient.address.postal_code}{" "}
              {medicalRecord.patient.address.country}
            </p>
            <p>
              <span className="font-semibold">Language:</span>{" "}
              {medicalRecord.patient.languages.map((lang, index) => (
                <Badge key={index}>{lang.name}</Badge>
              ))}
            </p>
          </div>
        </div>
      </div>
      <div>
        <h4 className="text-lg font-semibold">Disorders</h4>
        <div className="flex flex-wrap gap-2">
          {medicalRecord.disorders.map((disorder, idx) => (
            <HoverCard key={idx}>
              <HoverCardTrigger>
                <Badge>{disorder.name}</Badge>
              </HoverCardTrigger>
              <HoverCardContent>
                <p>First Noticed: {disorder.first_noticed}</p>
                <p>Details: {disorder.details}</p>
              </HoverCardContent>
            </HoverCard>
          ))}
        </div>
      </div>
    </div>
  );
}
