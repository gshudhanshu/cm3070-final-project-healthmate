"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

import { useEffect } from "react";
import { useUserProfileStore } from "@/store/useUserProfileStore";
import ErrorComponent from "@/components/common/error";
import LoadingComponent from "@/components/common/loading";
import ProfileHeader from "@/components/doctor-profile/profile-header";
import AboutMe from "@/components/doctor-profile/about-me";
import ReviewsSection from "@/components/doctor-profile/reviews";

export default function Page({
  params,
}: {
  params: { doctorUsername: string };
}) {
  const { doctorUsername } = params;

  const { doctorProfile, fetchDoctorProfile, isLoading, error } =
    useUserProfileStore();

  useEffect(() => {
    if (doctorUsername) {
      fetchDoctorProfile(doctorUsername);
    }
  }, []);

  if (isLoading) return <LoadingComponent />;
  if (error) return <ErrorComponent message={error.message} />;

  return doctorProfile ? (
    <div className="container mx-auto my-10 flex flex-col gap-10">
      <ProfileHeader doctor={doctorProfile} />
      <div className="flex flex-col gap-10 sm:flex-row">
        <AboutMe doctor={doctorProfile} className="w-full max-w-60 flex-grow" />
        <div className="flex flex-col gap-6">
          <section className="description">
            <div className="whitespace-pre-line">
              {doctorProfile.description || "No description provided"}
            </div>
          </section>
          <ReviewsSection doctor={doctorProfile} />
        </div>
      </div>
    </div>
  ) : (
    <ErrorComponent message="Profile not found" />
  );
}
