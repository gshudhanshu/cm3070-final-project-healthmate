"use client";

import React from "react";
import { DoctorProfileForm } from "@/components/profile/doctor-profile";

export default function page() {
  return (
    <section className="container mb-8 space-y-4 px-0">
      <DoctorProfileForm />
    </section>
  );
}
