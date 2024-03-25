import React from "react";
import { Badge } from "@/components/ui/badge";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMedicalRecordsStore } from "@/store/useMedicalRecordStore";

export default function PersonalDetails({ className }: { className?: string }) {
  const { medicalRecord } = useMedicalRecordsStore();
  // If medicalRecord doesn't have patient data, display "No result found"
  if (!medicalRecord?.hasOwnProperty("patient")) {
    return <div>No result found</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="my-4 text-xl font-semibold">Personal Information</h2>

      {/* Avatar */}
      <div>
        <Avatar className="h-40 w-40">
          <AvatarImage src={medicalRecord?.patient?.profile_pic || ""} />
          <AvatarFallback>
            {medicalRecord.patient?.user?.first_name[0] || "P"}
          </AvatarFallback>
        </Avatar>
      </div>
      {/* Patient Information */}
      <div>
        <div className="flex flex-col">
          <div>
            <p>
              <span className="font-semibold">Name:</span>
              {medicalRecord?.patient?.user?.first_name || ""}{" "}
              {medicalRecord?.patient?.user?.last_name || ""}
            </p>
            <p>
              <span className="font-semibold">Gender:</span>{" "}
              {medicalRecord?.patient?.gender || ""}
            </p>
            <p>
              <span className="font-semibold">Age:</span>{" "}
              {(medicalRecord?.patient?.dob &&
                new Date().getFullYear() -
                  new Date(medicalRecord?.patient?.dob).getFullYear()) ||
                ""}
            </p>
            <p>
              <span className="font-semibold">Height:</span>{" "}
              {medicalRecord?.patient?.height || ""} cm
            </p>
            <p>
              <span className="font-semibold">Weight:</span>{" "}
              {medicalRecord?.patient?.weight || ""} Kg
            </p>
            <p>
              <span className="font-semibold">Date of Birth:</span>{" "}
              {medicalRecord?.patient?.dob || ""}
            </p>
            <p>
              <span className="font-semibold">Blood Group:</span>{" "}
              {medicalRecord?.patient?.blood_group || ""}
            </p>
            <p>
              <span className="font-semibold">Marital Status:</span>{" "}
              {medicalRecord?.patient?.marital_status || ""}
            </p>
          </div>
          <div>
            <p>
              <span className="font-semibold">Email:</span>{" "}
              {medicalRecord?.patient?.user?.email || ""}
            </p>
            <p>
              <span className="font-semibold">Mobile:</span>{" "}
              {medicalRecord?.patient?.phone || ""}
            </p>
            <p>
              <span className="font-semibold">Location:</span>{" "}
              {medicalRecord?.patient?.address?.city || ""}{" "}
              {medicalRecord?.patient?.address?.state || ""}{" "}
              {medicalRecord?.patient?.address?.postal_code || ""}{" "}
              {medicalRecord?.patient?.address?.country || ""}
            </p>
          </div>
        </div>
      </div>
      {/* Languages */}
      <div>
        <h4 className="font-semibold">Language</h4>
        <div className="flex flex-wrap gap-2">
          {medicalRecord.patient.languages.map((lang, idx) => (
            <Badge key={idx}>{lang?.name || ""}</Badge>
          ))}
        </div>
      </div>
      {/* Disorders */}
      <div>
        <h4 className="font-semibold">Disorders</h4>
        <div className="flex flex-wrap gap-2">
          {medicalRecord.disorders.map((disorder, idx) => (
            <HoverCard key={idx}>
              <HoverCardTrigger>
                <Badge>{disorder?.name || ""}</Badge>
              </HoverCardTrigger>
              <HoverCardContent>
                <p>
                  <b>First Noticed:</b> {disorder?.first_noticed || ""}
                </p>
                <p>
                  <b>Details:</b> {disorder?.details || ""}
                </p>
              </HoverCardContent>
            </HoverCard>
          ))}
        </div>
      </div>
    </div>
  );
}
