"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

import { useEffect } from "react";
import { useDoctorProfileStore } from "@/store/useDoctorProfileStore";
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
    useDoctorProfileStore();

  useEffect(() => {
    if (doctorUsername) {
      fetchDoctorProfile(doctorUsername);
    }
  }, [doctorUsername, fetchDoctorProfile]);

  if (isLoading) return <LoadingComponent />;
  if (error) return <ErrorComponent message={error.message} />;

  return doctorProfile ? (
    <div className="container mx-auto my-10 flex flex-col gap-10">
      <ProfileHeader doctor={doctorProfile} />
      <section className="description">
        <p className="">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
          autem sint provident suscipit doloremque fugit tempore cumque sunt
          quae, reiciendis libero natus vitae eum iste maxime laborum mollitia
          molestiae unde.
        </p>
      </section>
      <AboutMe doctor={doctorProfile} />
      <ReviewsSection doctor={doctorProfile} />
    </div>
  ) : (
    <ErrorComponent message="Profile not found" />
  );
}
