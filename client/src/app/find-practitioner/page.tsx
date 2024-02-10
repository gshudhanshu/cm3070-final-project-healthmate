"use client";
import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  BriefcaseIcon,
  BuildingOfficeIcon,
  ChevronUpDownIcon,
  ClockIcon,
  MagnifyingGlassCircleIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/24/solid";
// import { Slider } from "@/components/ui/slider";
import { Slider } from "@/components/ui/dual-slider";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import AppointmentModal from "@/components/find-practitioner/appointments-modal";
import { useFindDocStore } from "@/store/useFindDocStore"; // Import the store

const filters = [
  {
    name: "Availability",
    type: "checkbox",

    options: [
      {
        name: "Full time",
        value: "full-time",
      },
      {
        name: "Part time",
        value: "part-time",
      },
      {
        name: "Weekdays",
        value: "weekdays",
      },
      {
        name: "Evenings",
        value: "evenings",
      },
    ],
  },

  {
    name: "Cost",
    type: "range",
    start: 0,
    end: 500,
    step: 5,
    unit: "USD",
  },

  {
    name: "Experience",
    type: "range",
    start: 0,
    end: 20,
    step: 1,
    unit: "years",
  },

  {
    name: "Speciality",
    type: "checkbox",
    options: [
      {
        name: "Pediatrics",
        value: "pediatrics",
      },
      {
        name: "Endocrinology",
        value: "endocrinology",
      },
      {
        name: "Rheumatology",
        value: "rheumatology",
      },
      {
        name: "Cardiology",
        value: "cardiology",
      },
      {
        name: "Neurology",
        value: "neurology",
      },
      {
        name: "Gastroenterology",
        value: "gastroenterology",
      },
      {
        name: "Dermatology",
        value: "dermatology",
      },
      {
        name: "Psychiatry",
        value: "psychiatry",
      },
      {
        name: "Oncology",
        value: "oncology",
      },
      {
        name: "Ophthalmology",
        value: "ophthalmology",
      },
      {
        name: "Urology",
        value: "urology",
      },
      {
        name: "Orthopedics",
        value: "orthopedics",
      },
      {
        name: "Obstetrics",
        value: "obstetrics",
      },
      {
        name: "Gynecology",
        value: "gynecology",
      },
      {
        name: "Nephrology",
        value: "nephrology",
      },
      {
        name: "Pulmonology",
        value: "pulmonology",
      },
      {
        name: "Otolaryngology",
        value: "otolaryngology",
      },
      {
        name: "Allergy",
        value: "allergy",
      },
      {
        name: "Immunology",
        value: "immunology",
      },
      {
        name: "General",
        value: "general",
      },
      {
        name: "Internal",
        value: "internal",
      },
      {
        name: "Medicine",
        value: "medicine",
      },
      {
        name: "Plastic",
        value: "plastic",
      },
    ],
  },

  {
    name: "Qualification",
    type: "checkbox",

    options: [
      {
        name: "MBBS",
        value: "mbbs",
      },
      {
        name: "MD",
        value: "md",
      },
      {
        name: "MS",
        value: "ms",
      },
      {
        name: "DM",
        value: "dm",
      },
      {
        name: "MCh",
        value: "mch",
      },
      {
        name: "DNB",
        value: "dnb",
      },
      {
        name: "MDS",
        value: "mds",
      },
      {
        name: "BDS",
        value: "bds",
      },
      {
        name: "BAMS",
        value: "bams",
      },
      {
        name: "BHMS",
        value: "bhms",
      },
      {
        name: "BUMS",
        value: "bums",
      },
      {
        name: "BPT",
        value: "bpt",
      },
      {
        name: "BSc",
        value: "bsc",
      },
      {
        name: "MSc",
        value: "msc",
      },
      {
        name: "BSc Nursing",
        value: "bsc-nursing",
      },
      {
        name: "MSc Nursing",
        value: "msc-nursing",
      },
      {
        name: "BPharm",
        value: "bpharm",
      },
      {
        name: "MPharm",
        value: "mpharm",
      },
    ],
  },

  {
    name: "Language",
    type: "checkbox",

    options: [
      {
        name: "English",
        value: "english",
      },
      {
        name: "French",
        value: "french",
      },
      {
        name: "Spanish",
        value: "spanish",
      },
      {
        name: "German",
        value: "german",
      },
      {
        name: "Italian",
        value: "italian",
      },
      {
        name: "Chinese",
        value: "chinese",
      },
      {
        name: "Japanese",
        value: "japanese",
      },
      {
        name: "Russian",
        value: "russian",
      },
      {
        name: "Portuguese",
        value: "portuguese",
      },
      {
        name: "Hindi",
        value: "hindi",
      },
      {
        name: "Arabic",
        value: "arabic",
      },
      {
        name: "Korean",
        value: "korean",
      },
      {
        name: "Vietnamese",
        value: "vietnamese",
      },
      {
        name: "Italian",
        value: "italian",
      },
      {
        name: "Thai",
        value: "thai",
      },
    ],
  },
];

export default function Page() {
  const {
    searchDoctors,
    setSearchParams,
    doctors,
    searchParams,
    pagination,
    fetchDoctor,
  } = useFindDocStore();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModalWithDoctor = (doctorUsername: string) => {
    useFindDocStore.setState({ doctorUsername });
    setIsModalOpen(true);
  };

  useEffect(() => {
    searchDoctors(); // Perform an initial search
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchParams({ [name]: value, page: 1 });
  };

  const handleCheckboxChange = (
    filterName: string,
    optionValue: string,
    checked: boolean,
  ) => {
    const isChecked = checked;
    const currentValues =
      (searchParams[filterName.toLowerCase()] as string[]) || [];
    const updatedValues = isChecked
      ? [...currentValues, optionValue]
      : currentValues.filter((value) => value !== optionValue);
    setSearchParams({
      ...searchParams,
      [filterName.toLowerCase()]: updatedValues,
      page: 1,
    });
    console.log(searchParams);
  };

  const handleSliderChange = (
    filterName: string,
    [start, end]: [number, number],
  ) => {
    const startParam = `${filterName.toLowerCase()}_min`;
    const endParam = `${filterName.toLowerCase()}_max`;

    setSearchParams({
      [startParam]: start,
      [endParam]: end,
      page: 1,
    });
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams({ page: newPage });
    searchDoctors();
  };

  return (
    <section className="container px-4 mx-auto text-slate-600 sm:px-6 lg:px-8 dark:text-slate-400">
      <div className="py-8">
        {/* Search  */}
        <div className="py-8">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {/* Search Input */}
            <div className="flex w-full max-w-[25rem] rounded-lg">
              <Input
                type="text"
                name="doctor_name"
                placeholder="Practitioner name"
                className="h-[2.875rem] flex-grow rounded-r-md "
                onChange={(e) => handleInputChange(e)}
              />
            </div>

            {/* Location Input  */}
            <div className="flex w-full max-w-[25rem] rounded-lg">
              <Input
                type="text"
                name="location"
                placeholder="City or zip code"
                className="h-[2.875rem] flex-grow rounded-r-md "
                onChange={(e) => handleInputChange(e)}
              />
            </div>
            {/* Find a Doc Button  */}
            <Button
              className="h-[2.875rem]  p-0 px-4 "
              onClick={(e) => searchDoctors()}
            >
              <MagnifyingGlassIcon className="w-6 h-6" /> Find a doc
            </Button>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Filters Section  */}
          <aside className="hidden w-full mb-6 max-w-48 md:block">
            <div className="font-bold uppercase">Filters</div>
            <Accordion
              type="multiple"
              defaultValue={["Availability", "Price", "Experience"]}
            >
              {filters.map((filter) => (
                <AccordionItem key={filter.name} value={filter.name}>
                  <AccordionTrigger className="hover:no-underline">
                    {filter.name}
                    {filter.unit ? ` (${filter.unit})` : ""}
                  </AccordionTrigger>
                  <AccordionContent className="flex flex-col gap-2">
                    {filter.type === "checkbox" ? (
                      filter.options?.map((option) => (
                        <div
                          key={filter.name + option.value}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={filter.name + option.value}
                            checked={searchParams[filter.name]?.includes(
                              option.value,
                            )}
                            onCheckedChange={(checked: boolean) => {
                              handleCheckboxChange(
                                filter.name,
                                option.value,
                                checked,
                              );
                            }}
                          />
                          <label
                            htmlFor={filter.name + option.value}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {option.name}
                          </label>
                        </div>
                      ))
                    ) : (
                      <div>
                        <Slider
                          className="h-5"
                          min={filter.start || 0}
                          max={filter.end || 500}
                          step={filter.step || 1}
                          minStepsBetweenThumbs={1}
                          onValueChange={(values) =>
                            handleSliderChange(filter.name, [
                              values[0],
                              values[1],
                            ])
                          }
                        />
                        <div className="flex justify-between">
                          <span>{filter.start}</span>
                          <span>{filter.end}</span>
                        </div>
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </aside>

          {/* Doctors List Section  */}
          <section className="w-full lg:w-3/4">
            <div className="pb-3">Showing {doctors.length} results</div>
            <div className="space-y-4">
              {/* Repeat this block for each doctor  */}
              {doctors.map((doctor, idx) => (
                <div key={idx} className="p-4 bg-white rounded-md shadow">
                  <div className="flex flex-col items-start gap-6 md:flex-row">
                    {/* Image and rating */}
                    <div className="flex flex-col items-center justify-center gap-2 max-w-20">
                      <div className="flex items-center justify-center w-20 h-20 rounded-lg bg-primary">
                        <Image
                          src={doctor.profile_pic || ""}
                          height={50}
                          width={50}
                          alt="doctor-image"
                          className="w-full h-full rounded-md bg-primary"
                        />
                        {/* Image */}
                      </div>
                      <div className="flex items-center justify-center gap-1 p-1 px-3 m-0 text-sm font-bold rounded-lg bg-primary/10">
                        <StarIcon className="w-5 h-5 text-primary" />{" "}
                        {doctor.average_rating}
                      </div>
                    </div>
                    {/* Name, description, extra details */}

                    <div className="flex flex-col w-full gap-2">
                      <div className="flex justify-between">
                        <h3 className="text-xl font-semibold capitalize">
                          {doctor.user.first_name + " " + doctor.user.last_name}
                        </h3>
                      </div>
                      <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-1">
                          <BuildingOfficeIcon className="w-5 h-5 p-0 m-0" />
                          {`${doctor.hospital_address.city}, ${doctor.hospital_address.country}`}
                        </div>
                        <div className="flex items-center gap-1">
                          <BriefcaseIcon className="w-5 h-5" />
                          {`${doctor.specialties[0].name} + ${
                            doctor.specialties.length - 1
                          } more`}
                        </div>
                        <div className="flex items-center gap-1">
                          <ClockIcon className="w-5 h-5" />
                          {doctor.availability}
                        </div>
                      </div>
                      <p className="truncate line-clamp-2 text-wrap">
                        {doctor.description}
                      </p>
                      {/* Appointments slots */}
                      <div className="flex flex-col flex-wrap justify-between gap-4 mt-4 md:flex-row md:items-center">
                        <div className="flex flex-col gap-2 md:flex-row md:items-center">
                          <p className="font-bold">Today&apos;s slots</p>
                          <div className="flex flex-wrap gap-2 grow">
                            {doctor.appointment_slots.map((slot, idx) => (
                              <span
                                key={idx}
                                className={`rounded-sm p-1 font-semibold ${
                                  slot.status == "unbooked"
                                    ? "bg-primary"
                                    : "bg-secondary"
                                }`}
                              >
                                {slot.time.split(":")[0]}
                              </span>
                            ))}
                          </div>
                        </div>
                        {/* price book button */}
                        <div className="flex flex-col gap-3 md:flex-row md:items-center">
                          <p className="text-2xl font-bold text-primary">
                            {doctor.cost && Number(doctor.cost) > 0
                              ? doctor.cost + " " + doctor.currency
                              : "Free"}
                          </p>
                          <Button
                            variant="default"
                            className="max-w-40"
                            onClick={() =>
                              openModalWithDoctor(doctor.user.username)
                            }
                          >
                            Book Appointment
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <Pagination>
                <PaginationContent className="flex flex-wrap">
                  <PaginationPrevious
                    onClick={() => handlePageChange(pagination.previous_page)}
                    className="cursor-pointer"
                  />

                  {Array.from(
                    { length: pagination.count },
                    (_, i) => i + 1,
                  ).map((pageNum) => (
                    <PaginationLink
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      isActive={pageNum == pagination.current_page}
                      className="cursor-pointer"
                    >
                      {pageNum}
                    </PaginationLink>
                  ))}
                  <PaginationNext
                    onClick={() =>
                      handlePageChange(
                        pagination.next_page
                          ? pagination.next_page
                          : pagination.current_page,
                      )
                    }
                    className="cursor-pointer "
                  />
                </PaginationContent>
              </Pagination>
            </div>
          </section>
        </div>
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
