"use client";
import React, { useState } from "react";
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
import { Slider } from "@/components/ui/slider";
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
    name: "Price",
    type: "range",
    start: 0,
    end: 500,
    step: 10,
  },

  {
    name: "Experience",
    type: "checkbox",
    options: [
      {
        name: "1 - 5 years",
        value: "1-5",
      },
      {
        name: "5 - 10 years",
        value: "5-10",
      },
      {
        name: "10 - 15 years",
        value: "10-15",
      },
      {
        name: "15 - 20 years",
        value: "15-20",
      },
      {
        name: "Above 20 years",
        value: "above-20",
      },
    ],
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

function page() {
  return (
    <section className="container mx-auto px-4 text-slate-600 sm:px-6 lg:px-8 dark:text-slate-400">
      <div className="py-8">
        {/* Search  */}
        <div className="py-8">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {/* Search Input */}
            <div className="flex w-full max-w-[25rem] rounded-lg">
              <Input
                type="text"
                placeholder="Practitioner name"
                className="h-[2.875rem] flex-grow rounded-r-md "
              />
            </div>

            {/* Location Input  */}
            <div className="flex w-full max-w-[25rem] rounded-lg">
              <Input
                type="text"
                placeholder="City or zip code"
                className="h-[2.875rem] flex-grow rounded-r-md "
              />
            </div>
            {/* Find a Doc Button  */}
            <Button className="h-[2.875rem]  p-0 px-4 ">
              <MagnifyingGlassIcon className="h-6 w-6" /> Find a doc
            </Button>
          </div>
        </div>

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
                  </AccordionTrigger>
                  <AccordionContent className="flex flex-col gap-2">
                    {filter.type === "checkbox" ? (
                      filter.options?.map((option) => (
                        <div
                          key={filter.name + option.value}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox id={filter.name + option.value} />
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
                          defaultValue={[0]}
                          max={filter.end}
                          min={filter.start}
                          step={filter.step}
                        />
                        <div className="flex justify-between">
                          <span>${filter.start}</span>
                          <span>$ current value</span>
                          <span>${filter.end}</span>
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
            <div className="pb-3">Showing 1272 results</div>
            <div className="space-y-4">
              {/* Repeat this block for each doctor  */}
              {/* Block start */}
              <div className="rounded-md bg-white p-4 shadow">
                <div className="flex flex-col items-start justify-between gap-6 md:flex-row">
                  {/* Image and rating */}
                  <div className="flex max-w-20 flex-col items-center justify-center gap-2">
                    <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-primary">
                      <Image
                        src={"/next.svg"}
                        height={50}
                        width={50}
                        alt="doctor-image"
                        className="h-full w-full rounded-md bg-primary"
                      />
                      {/* Image */}
                    </div>
                    <div className="m-0 flex items-center justify-center gap-1 rounded-lg bg-primary/10 p-1 px-3 text-sm font-bold">
                      <StarIcon className="h-5 w-5 text-primary" /> 4.8
                    </div>
                  </div>
                  {/* Name, description, extra details */}

                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between">
                      <h3 className="text-xl font-semibold">Dr. Name</h3>
                      {/* <p className="text-2xl font-bold text-primary">Price</p> */}
                    </div>
                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center gap-1">
                        <BuildingOfficeIcon className="m-0 h-5 w-5 p-0" />
                        Location
                      </div>
                      <div className="flex items-center gap-1">
                        <BriefcaseIcon className="h-5 w-5" /> Speciality
                      </div>
                      <div className="flex items-center gap-1">
                        <ClockIcon className="h-5 w-5" /> Availability
                      </div>
                    </div>
                    <p className="">
                      Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                      Modi ipsum, esse eum voluptatem sed iusto sunt similique?
                      Nam, itaque!
                    </p>
                    {/* Appointments slots */}
                    <div className="mt-4 flex flex-col flex-wrap justify-between gap-4 md:flex-row md:items-center">
                      <div className="flex flex-col gap-2 md:flex-row md:items-center">
                        <p className="font-bold">Today&apos;s slots</p>
                        <div className="flex grow flex-wrap gap-2">
                          <span className="rounded-sm bg-primary p-1 font-semibold">
                            8
                          </span>
                        </div>
                      </div>
                      {/* price book button */}
                      <div className="flex flex-col gap-3 md:flex-row md:items-center">
                        <p className="text-2xl font-bold text-primary">Price</p>
                        <Button variant="default" className="max-w-40">
                          Book Appointment
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Block end */}
            </div>
            <div className="mt-6">
              <Pagination>
                <PaginationContent className="flex flex-wrap">
                  <PaginationPrevious href="#" />
                  <PaginationLink href="#" isActive>
                    1
                  </PaginationLink>
                  <PaginationLink href="#">2</PaginationLink>
                  <PaginationLink href="#">3</PaginationLink>
                  <PaginationEllipsis />
                  <PaginationLink href="#">3</PaginationLink>
                  <PaginationNext href="#" />
                </PaginationContent>
              </Pagination>
            </div>
          </section>
        </div>
      </div>
      <AppointmentModal />
    </section>
  );
}

export default page;
