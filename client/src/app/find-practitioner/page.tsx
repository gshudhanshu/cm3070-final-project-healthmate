"use client";
import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Badge } from "@/components/ui/badge";

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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone.js";
import utc from "dayjs/plugin/utc.js";
dayjs.extend(utc);
dayjs.extend(timezone);

const localTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

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
    fetchDoctorWithSlots,
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
    <>
      {/* Search  */}
      <div className="bg-slate-100 py-8 dark:bg-slate-700">
        <div className="flex flex-wrap items-center justify-center gap-3">
          <h2 className="text-xl font-bold uppercase text-primary">
            Find doctor
          </h2>
          {/* Search Input */}
          <div className="flex w-full max-w-[40rem] flex-col gap-4 rounded-lg md:flex-row">
            <Input
              type="text"
              name="doctor_name"
              placeholder="Practitioner name"
              className="h-[2.875rem] w-full flex-grow rounded-r-md "
              onChange={(e) => handleInputChange(e)}
            />

            {/* Location Input  */}
            <Input
              type="text"
              name="location"
              placeholder="City or zip code"
              className="h-[2.875rem] w-full flex-grow rounded-r-md "
              onChange={(e) => handleInputChange(e)}
            />
          </div>
          {/* Find a Doc Button  */}
          <Button
            className="h-[2.875rem]  p-0 px-4 "
            onClick={(e) => searchDoctors()}
          >
            <MagnifyingGlassIcon className="h-6 w-6" /> Find a doc
          </Button>
        </div>
      </div>
      <section className="container mx-auto px-4 text-slate-600 sm:px-6 lg:px-8 dark:text-slate-400">
        <div className="py-8">
          <div className="flex gap-8">
            {/* Filters Section  */}
            <aside className="mb-6 hidden w-full max-w-48 md:block">
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
                            data-testid="slider-handle"
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
                  <div
                    key={idx}
                    className="rounded-md bg-slate-100 p-4 shadow dark:bg-slate-800 "
                  >
                    <div className="flex flex-col items-start gap-6 md:flex-row">
                      {/* Image and rating */}
                      <div className="flex max-w-20 flex-col items-center justify-center gap-2">
                        <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-primary">
                          {/* <Image
                            src={doctor.profile_pic || ""}
                            height={50}
                            width={50}
                            alt="doctor-image"
                            className="w-full h-full rounded-md bg-primary"
                          /> */}
                          <Avatar className="h-20 w-20 rounded-md">
                            <AvatarImage
                              src={doctor.profile_pic || ""}
                              alt={doctor.user.username}
                            />
                            <AvatarFallback className="rounded-md">
                              {doctor.user.first_name.charAt(0) +
                                doctor.user.last_name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>

                          {/* Image */}
                        </div>
                        <div className="m-0 flex items-center justify-center gap-1 rounded-lg bg-primary/10 p-1 px-3 text-sm font-bold">
                          <StarIcon className="h-5 w-5 text-primary" />{" "}
                          {doctor.average_rating}
                        </div>
                      </div>
                      {/* Name, description, extra details */}

                      <div className="flex w-full flex-col gap-2">
                        <div className="flex justify-between">
                          <h3 className="text-xl font-semibold capitalize">
                            {doctor.user.first_name +
                              " " +
                              doctor.user.last_name}
                          </h3>
                        </div>
                        <div className="flex flex-wrap gap-4">
                          <div className="flex items-center gap-1">
                            <BuildingOfficeIcon className="m-0 h-5 w-5 p-0" />
                            {`${doctor?.hospital_address?.city || ""}, ${
                              doctor?.hospital_address?.country || ""
                            }`}
                          </div>
                          <div className="flex items-center gap-1">
                            <BriefcaseIcon className="h-5 w-5" />
                            {
                              <HoverCard key={idx}>
                                <HoverCardTrigger>
                                  <Badge>
                                    {doctor?.specialties &&
                                      doctor?.specialties.length > 0 &&
                                      `${doctor?.specialties[0].name || ""}${
                                        doctor?.specialties.length > 1
                                          ? ` + ${
                                              doctor?.specialties.length - 1
                                            } more`
                                          : ""
                                      }`}
                                  </Badge>
                                </HoverCardTrigger>
                                <HoverCardContent>
                                  <p>
                                    {doctor?.specialties &&
                                      doctor?.specialties.map(
                                        (speciality, idx) => (
                                          <p key={idx}>{speciality?.name}</p>
                                        ),
                                      )}
                                  </p>
                                </HoverCardContent>
                              </HoverCard>
                            }
                          </div>
                          <div className="flex items-center gap-1">
                            <ClockIcon className="h-5 w-5" />
                            {doctor.availability}
                          </div>
                        </div>
                        <p className="line-clamp-2 truncate text-wrap">
                          {doctor.description}
                        </p>
                        {/* Appointments slots */}
                        <div className="mt-4 flex flex-col flex-wrap justify-between gap-4 md:flex-row md:items-center">
                          <div className="flex flex-col gap-2 md:flex-row md:items-center">
                            <p className="font-bold">Today&apos;s slots</p>
                            <div className="grid grid-flow-col grid-rows-3 gap-2 gap-y-1 md:grid-rows-2">
                              {doctor?.appointment_slots?.map((slot, idx) => (
                                <span
                                  key={idx}
                                  className={`rounded-sm p-1 px-2 text-xs font-semibold ${
                                    slot.status == "unbooked"
                                      ? "bg-secondary"
                                      : "bg-destructive text-white"
                                  }`}
                                >
                                  {dayjs(slot.datetime_utc)
                                    .tz(localTimezone, true)
                                    .format("h:mm A")}
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
                      data-testid="pagination-previous"
                    />

                    {Array.from(
                      { length: pagination.total_pages },
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
    </>
  );
}
