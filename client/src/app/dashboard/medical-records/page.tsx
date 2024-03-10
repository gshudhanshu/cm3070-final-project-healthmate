"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PersonalDetails from "@/components/medical-records/personal-details";
import { useMedicalRecordsStore } from "@/store/useMedicalRecordStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useMessagesStore } from "@/store/useMessageStore";
import LoadingComponent from "@/components/common/loading";
import ActiveMedicines from "@/components/medical-records/active-medicines";
import RecentDiagnosis from "@/components/medical-records/recent-diagnosis";
import AppointmentHistory from "@/components/medical-records/appointment-history";

export default function Page({
  isDoctorFetching,
}: {
  isDoctorFetching?: boolean;
}) {
  const { fetchMedicalRecords, medicalRecord } = useMedicalRecordsStore();
  const { selectedConversation } = useMessagesStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (isDoctorFetching) {
      fetchMedicalRecords(
        selectedConversation?.patient?.username || "",
        selectedConversation?.id.toString(),
      );
    } else if (user?.username) {
      fetchMedicalRecords(user?.username);
    }
  }, [selectedConversation]);

  if (!medicalRecord) return <LoadingComponent />;
  if (!medicalRecord?.hasOwnProperty("patient"))
    return (
      <div className="flex h-[40rem] max-h-screen items-center justify-center">
        <div>
          <h2 className="text-2xl">No results found!</h2>
        </div>
      </div>
    );

  return (
    <section className="container my-8 flex flex-col">
      <div className="mb-4">
        <h2 className="text-center text-3xl font-medium">Medical Records</h2>
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <div className="mb-4 flex flex-col items-center justify-between">
          <PersonalDetails />
        </div>
        <div className="flex flex-col gap-4 ">
          <ActiveMedicines />
          <RecentDiagnosis />
        </div>
        <div className="mb-4 flex">
          <AppointmentHistory />
        </div>
      </div>
    </section>
  );
}
