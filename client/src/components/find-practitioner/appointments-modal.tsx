import { SetStateAction, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ArrowUpRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/solid";
import { Button } from "../ui/button";
import { DoctorProfile, Slot } from "@/types/user";
import { useFindDocStore } from "@/store/useFindDocStore";
import LoadingComponent from "@/components/common/loading";
import ErrorComponent from "@/components/common/error";

import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone.js";
import utc from "dayjs/plugin/utc.js";
import { Input } from "@/components/ui/input";
dayjs.extend(utc);
dayjs.extend(timezone);

// Mock data for available slots
const availableSlots = [
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
  "6:00 PM",
];

// Helper function to add days to a date
const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

// Helper function to check if the date is within the next 7 days from today
const isWithinNextWeek = (date: Date): boolean => {
  const today = new Date();
  const weekFromToday = addDays(today, 7);
  return date >= today && date <= weekFromToday;
};

const isDateInPast = (date: Date): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
};

// Helper function to format date as YYYY-MM-DD
const formatDate = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

const localTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

const AppointmentModal = ({
  isModalOpen,
  closeModal,
}: {
  isModalOpen: boolean;
  closeModal: Function;
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState<Slot>({} as Slot);
  const [slots, setSlots] = useState<Slot[]>([] as Slot[]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { fetchDoctor, doctorUsername, doctor, bookAppointment, purpose } =
    useFindDocStore();

  const selectSlot = (slot: SetStateAction<Slot>) => {
    setSelectedSlot(slot);
  };

  const handleBookAppointment = () => {
    if (selectedSlot.status == "booked") {
      alert("This slot is already booked");
      return;
    }
    console.log("Booking appointment for", selectedSlot.datetime_utc);
    bookAppointment(doctorUsername, selectedSlot.datetime_utc, purpose);
    alert("Appointment booked successfully");
  };

  useEffect(() => {
    console.log("Fetching slots for", doctorUsername);
    const fetchSlots = async () => {
      try {
        const timezone = dayjs.tz.guess();
        const date = formatDate(selectedDate);
        console.log(timezone);
        await fetchDoctor(doctorUsername, date, timezone);
        console.log("Fetching slots for", doctorUsername);
        console.log("Doctor", doctor);
        if (!doctor) {
          alert("Doctor not found");
          return;
        }

        setSlots(doctor.appointment_slots);
      } catch (error) {
        console.error("Failed to fetch slots:", error);
        // Handle errors as appropriate for your application
      }
      setIsLoading(false);
    };

    // if (isWithinNextWeek(selectedDate)) {
    fetchSlots();
    // }
  }, [selectedDate]);

  const navigateDate = (days: number) => {
    const newDate = addDays(selectedDate, days);
    if (isWithinNextWeek(newDate)) {
      setSelectedDate(newDate);
    }
  };

  if (isLoading) {
    return <LoadingComponent />;
  }

  if (!doctor) {
    return <ErrorComponent />;
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={(e) => closeModal()}>
      {/* <DialogTrigger asChild>
        <button>Edit Profile</button>
      </DialogTrigger> */}

      <DialogContent className="gap-0 p-0 m-0 border-0">
        <DialogHeader className="p-4 text-white rounded-t-lg bg-primary">
          <DialogTitle className="text-center">Book an appointment</DialogTitle>
        </DialogHeader>
        {/* Doctor's Info */}
        <div className="text-center text-slate-600 dark:text-slate-400">
          <div className="flex flex-col items-center justify-between p-3 text-center bg-slate-200">
            <h2 className="w-full text-xl font-semibold text-center capitalize text-slate group">
              <a href={`/doctors/${doctor.user.username}`}>
                {doctor.user.first_name} {doctor.user.last_name}
              </a>
              <ArrowUpRightIcon className="inline w-4 h-4 ml-1 transition-all duration-100 rotate-45 group-hover:rotate-0" />
            </h2>
            <p className="text-sm">
              {doctor.specialties.map((j) => j.name).join(", ")}
            </p>
          </div>
        </div>
        <div className="px-5">
          {/* Date Navigation */}
          <div className="flex items-center justify-between my-5">
            <Button
              onClick={() => navigateDate(-1)}
              disabled={!isWithinNextWeek(addDays(selectedDate, -1))}
            >
              <ChevronLeftIcon className="w-6 h-6" />
            </Button>
            <span className="text-lg font-medium text-slate-600">
              {selectedDate.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </span>
            <Button
              onClick={() => navigateDate(1)}
              disabled={!isWithinNextWeek(addDays(selectedDate, 1))}
            >
              <ChevronRightIcon className="w-6 h-6" />
            </Button>
          </div>

          {/* Time Slots */}
          <div className="grid grid-cols-3 gap-4 mt-4 ">
            {isLoading ? (
              <LoadingComponent />
            ) : (
              doctor.appointment_slots.map((slot, index) => (
                <Button
                  key={index}
                  variant={
                    selectedSlot.time === slot.time
                      ? "default"
                      : slot.status === "booked"
                        ? "destructive"
                        : "secondary"
                  }
                  onClick={() => {
                    slot.status !== "booked" ? selectSlot(slot) : null;
                  }}
                  disabled={
                    slot.status === "booked" || isDateInPast(selectedDate)
                  }
                >
                  {dayjs(slot.datetime_utc)
                    .tz(localTimezone, true)
                    .format("h:mm A")}
                </Button>
              ))
            )}
          </div>
          <div className="flex items-center gap-2 pt-5">
            <label htmlFor="purpose" className="font-bold">
              Purpose:
            </label>
            <Input
              type="text"
              name="purpose"
              value={purpose}
              onChange={(event) =>
                useFindDocStore.setState({ purpose: event.target.value })
              }
            />
          </div>
        </div>
        <div className="grid items-center grid-cols-2 gap-2 p-5 text-center">
          <div className="text-xl font-semibold text-primary">
            Cost: {doctor.cost} {doctor.currency}
          </div>
          <Button onClick={() => handleBookAppointment()}>
            Book Appointment
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentModal;
