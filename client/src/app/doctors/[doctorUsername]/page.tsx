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
  const { otherDoctorProfile, fetchDoctorProfile, isLoading, error } =
    useUserProfileStore();

  // Fetch doctor profile based on doctor username
  useEffect(() => {
    if (doctorUsername) {
      fetchDoctorProfile(doctorUsername, true);
    }
  }, [doctorUsername]);

  // Display loading component while data is loading
  if (isLoading) return <LoadingComponent />;
  if (error) return <ErrorComponent message={error.message} />;

  // Render doctor profile if data is available
  return otherDoctorProfile ? (
    <div className="container mx-auto my-10 flex flex-col gap-10">
      <ProfileHeader doctor={otherDoctorProfile} />
      <div className="flex flex-col gap-10 sm:flex-row">
        <AboutMe
          doctor={otherDoctorProfile}
          className="w-full max-w-60 flex-grow"
        />
        <div className="flex flex-col gap-6">
          <section className="description">
            <div className="whitespace-pre-line">
              {otherDoctorProfile.description || "No description provided"}
            </div>
          </section>
          <ReviewsSection doctor={otherDoctorProfile} />
        </div>
      </div>
    </div>
  ) : (
    // Render error component if doctor profile is not found
    <ErrorComponent message="Profile not found" />
  );
}
