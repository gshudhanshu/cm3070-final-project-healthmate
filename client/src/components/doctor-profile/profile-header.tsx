// @ts-nocheck
import { DoctorProfile } from "@/types/user";
import React from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import { BuildingOffice2Icon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";
import AppointmentModal from "@/components/find-practitioner/appointments-modal";
import { useFindDocStore } from "@/store/useFindDocStore";
import { useState } from "react";

export default function ProfileHeader({
  doctor,
  className,
}: {
  doctor: DoctorProfile;
  className?: string;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModalWithDoctor = (doctorUsername: string) => {
    useFindDocStore.setState({ doctorUsername });
    setIsModalOpen(true);
  };

  return (
    <section
      className={cn(
        "flex w-full flex-col items-center justify-between gap-4 sm:flex-row",
        className,
      )}
    >
      <div className="flex w-full flex-col gap-6 sm:flex-row sm:items-center">
        <Image
          src={doctor.profile_pic || "https://placehold.co/200x200/png"}
          width={200}
          height={200}
          alt=""
          className="h-full w-full rounded-lg sm:w-24"
        />
        <div className="">
          <h3 className="text-xl font-medium ">
            Dr. {doctor.user.first_name} {doctor.user.last_name}
          </h3>
          <p className="flex items-center gap-2 text-sm">
            <BuildingOffice2Icon className="w-6" />
            {doctor.hospital_address.city}, {doctor.hospital_address.state},{" "}
            {doctor.hospital_address.country}{" "}
            {doctor.hospital_address.postal_code}
          </p>
        </div>
      </div>
      <div className="flex w-full flex-wrap items-center justify-between gap-2 sm:w-auto sm:flex-col">
        <p className="font-bold text-primary">Cost: {doctor.cost}</p>
        <Button onClick={() => openModalWithDoctor(doctor.user.username)}>
          Book Appointment
        </Button>
      </div>
      {isModalOpen && (
        <AppointmentModal
          isModalOpen={isModalOpen}
          closeModal={() => setIsModalOpen(false)}
        />
      )}
    </section>
  );
}
