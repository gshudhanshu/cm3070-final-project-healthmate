"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PersonalDetails from "@/components/medical-records/personal-details";
import { useMedicalRecordsStore } from "@/store/useMedicalRecordStore";
import { useAuthStore } from "@/store/useAuthStore";
import LoadingComponent from "@/components/common/loading";

export default function Page() {
  const { fetchMedicalRecords, medicalRecord } = useMedicalRecordsStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user && user.username) {
      fetchMedicalRecords(user?.id.toString());
    }
  }, [user?.username]);

  if (!medicalRecord) return <LoadingComponent />;

  return (
    <section className="container mx-auto my-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Medical Records</h2>
        <Button>Print</Button>
      </div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">Patient Information</h3>
        <PersonalDetails />
      </div>

      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">Medical History</h3>
        <Button>Edit</Button>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <h4 className="text-lg font-semibold">Active Medicines</h4>
        </div>
        <div>
          <h4 className="text-lg font-semibold">Recent Diagnosis</h4>
        </div>
      </div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">Appointment History</h3>
        <Button>Edit</Button>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <h4 className="text-lg font-semibold">Upcoming Appointments</h4>
        </div>
        <div>
          <h4 className="text-lg font-semibold">Past Appointments</h4>
        </div>
      </div>
    </section>
  );
}
