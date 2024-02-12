"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PersonalDetails from "@/components/medical-records/personal-details";
import { useMedicalRecordsStore } from "@/store/useMedicalRecordStore";
import { useAuthStore } from "@/store/useAuthStore";
import LoadingComponent from "@/components/common/loading";
import ActiveMedicines from "@/components/medical-records/active-medicines";
import RecentDiagnosis from "@/components/medical-records/recent-diagnosis";
import AppointmentHistory from "@/components/medical-records/appointment-history";

export default function Page({
  selectedPatientId,
}: {
  selectedPatientId?: number;
}) {
  const { fetchMedicalRecords, medicalRecord } = useMedicalRecordsStore();
  const { user } = useAuthStore();

  console.log(selectedPatientId);
  const [patientId, setPatientId] = useState<number | null>(
    selectedPatientId || user?.id || null,
  );

  useEffect(() => {
    console.log(patientId);
    if (patientId) {
      fetchMedicalRecords(patientId.toString());
    }
  }, []);

  if (!medicalRecord) return <LoadingComponent />;

  return (
    <section className="container flex flex-col my-8">
      <div className="mb-4">
        <h2 className="text-3xl font-medium text-center">Medical Records</h2>
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <div className="flex flex-col items-center justify-between mb-4">
          <PersonalDetails />
        </div>
        <div className="flex flex-col gap-4 ">
          <ActiveMedicines />
          <RecentDiagnosis />
        </div>
        <div className="flex mb-4">
          <AppointmentHistory />
        </div>
      </div>
    </section>
  );
}
