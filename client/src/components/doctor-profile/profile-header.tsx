// @ts-nocheck
import { DoctorProfile } from "@/types/user";
import React from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
  // State to manage modal open/close
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Function to open modal with doctor data
  const openModalWithDoctor = (doctorUsername: string) => {
    // Set the selected doctor's username in the store
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
      {/* Doctor's profile picture */}
      <div className="flex w-full flex-col gap-6 sm:flex-row sm:items-center">
        <Avatar className="h-full w-full rounded-lg sm:w-24">
          <AvatarImage
            src={doctor?.profile_pic || ""}
            alt={doctor?.user?.username || "username"}
          />
          <AvatarFallback>
            {doctor?.user?.first_name?.charAt(0) || "F"}
            {doctor?.user?.last_name?.charAt(0) || "L"}
          </AvatarFallback>
        </Avatar>

        <div className="">
          {/* Doctor's name */}
          <h3 className="text-xl font-medium ">
            Dr. {doctor?.user?.first_name || ""} {doctor?.user?.last_name || ""}
          </h3>
          {/* Hospital address */}
          <p className="flex items-center gap-2 text-sm">
            <BuildingOffice2Icon className="w-6" />
            {doctor?.hospital_address?.city || ""},{" "}
            {doctor?.hospital_address?.state || ""},{" "}
            {doctor?.hospital_address?.country || ""}{" "}
            {doctor?.hospital_address?.postal_code || ""}
          </p>
        </div>
      </div>
      <div className="flex w-full flex-wrap items-center justify-between gap-2 sm:w-auto sm:flex-col">
        {/* Cost */}
        <p className="font-bold text-primary">Cost: {doctor?.cost || ""}</p>
        {/* Book Appointment button */}
        <Button
          onClick={() => openModalWithDoctor(doctor?.user?.username || "")}
        >
          Book Appointment
        </Button>
      </div>
      {/* Appointment modal */}
      {isModalOpen && (
        <AppointmentModal
          isModalOpen={isModalOpen}
          closeModal={() => setIsModalOpen(false)}
        />
      )}
    </section>
  );
}
