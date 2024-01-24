"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

import { useEffect } from "react";
import { useDoctorProfileStore } from "@/store/useDoctorProfileStore";
import ErrorComponent from "@/components/common/error";
import LoadingComponent from "@/components/common/loading";

export default function Page({
  params,
}: {
  params: { doctorUsername: string };
}) {
  const { doctorUsername } = params;

  const { doctorProfile, fetchDoctorProfile, isLoading, error } =
    useDoctorProfileStore();

  useEffect(() => {
    if (doctorUsername) {
      fetchDoctorProfile(doctorUsername);
    }
  }, [doctorUsername, fetchDoctorProfile]);

  if (isLoading) return <LoadingComponent />;
  if (error) return <ErrorComponent message={error.message} />;

  return doctorProfile ? (
    <DoctorProfileComponent profile={doctorProfile} />
  ) : (
    <ErrorComponent message="Profile not found" />
  );
}
