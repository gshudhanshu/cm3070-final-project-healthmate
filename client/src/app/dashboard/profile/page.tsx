"use client";

import React from "react";
import { DoctorProfileForm } from "@/components/profile/doctor-profile";
import { PatientProfileForm } from "@/components/profile/patient-profile";

import { useAuthStore } from "@/store/useAuthStore";

export default function Page() {
  const { user } = useAuthStore();

  return (
    <section className="container mb-8">
      {user?.account_type === "doctor" ? (
        // Doctor profile form
        <DoctorProfileForm />
      ) : (
        // Patient profile form
        <PatientProfileForm />
      )}
    </section>
  );
}
