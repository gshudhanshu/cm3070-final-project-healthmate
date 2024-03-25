import { cn } from "@/lib/utils";
import { DoctorProfile } from "@/types/user";
import { CheckIcon } from "@heroicons/react/24/solid";
import React from "react";

export default function AboutMe({
  doctor,
  className,
}: {
  doctor: DoctorProfile;
  className?: string;
}) {
  return (
    <section className={cn("flex flex-col gap-5", className)}>
      {/* Display Speciality */}
      <div className="flex flex-col gap-1">
        <dt className="font-medium ">Speciality</dt>
        {doctor?.specialties?.map((speciality, index) => (
          <dd
            key={speciality.id}
            className="mt-1 flex items-center gap-1 text-sm sm:col-span-2 sm:mt-0"
          >
            <CheckIcon className="w-5" /> {speciality.name}
          </dd>
        ))}
      </div>
      {/* Display Experience */}
      <div className="flex flex-col gap-1">
        <dt className="font-medium ">Experience</dt>
        <dd className="mt-1 flex items-center gap-1 text-sm sm:col-span-2 sm:mt-0">
          {doctor.experience} years
        </dd>
      </div>
      {/* Display Languages */}
      <div className="flex flex-col gap-1">
        <dt className="font-medium ">Languages</dt>
        {doctor?.languages?.map((language, index) => (
          <dd
            key={language.name}
            className="mt-1 flex items-center gap-1 text-sm sm:col-span-2 sm:mt-0"
          >
            <CheckIcon className="w-5" /> {language.name} ({language.level})
          </dd>
        ))}
      </div>
      {/* Display Qualifications */}
      <div className="flex flex-col gap-1">
        <dt className="font-medium">Qualifications</dt>
        <div className="flex flex-col gap-3 ">
          {doctor?.qualifications?.map((qualification, index) => (
            <div className="" key={qualification.name}>
              <dd className="mt-1 flex items-center gap-1 text-sm font-bold sm:col-span-2 sm:mt-0">
                {qualification.name}
                {/* ({qualification.start_year} -{" "} */}
                {/* {qualification.finish_year}) */}
              </dd>
              <dd>
                <p className="text-sm">{qualification.university}</p>
              </dd>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
