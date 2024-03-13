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

  const {
    fetchDoctorWithSlots,
    doctorUsername,
    // doctor,
    doctorSlots,
    bookAppointment,
    purpose,
  } = useFindDocStore();

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
        await fetchDoctorWithSlots(doctorUsername, date, timezone);
        console.log("Fetching slots for", doctorUsername);
        console.log("Doctor", doctorSlots);
        if (!doctorSlots) {
          alert("Doctor not found");
          return;
        }

        setSlots(doctorSlots?.appointment_slots || []);
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

  if (!doctorSlots) {
    return <ErrorComponent />;
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={(e) => closeModal()}>
      {/* <DialogTrigger asChild>
        <button>Edit Profile</button>
      </DialogTrigger> */}

      <DialogContent className="m-0 gap-0 border-0 p-0">
        <DialogHeader className="rounded-t-lg bg-primary p-4 text-white">
          <DialogTitle className="text-center">Book an appointment</DialogTitle>
        </DialogHeader>
        {/* Doctor's Info */}
        <div className="text-center text-slate-600 dark:text-slate-400">
          <div className="flex flex-col items-center justify-between bg-slate-200 p-3 text-center">
            <h2 className="text-slate group w-full text-center text-xl font-semibold capitalize">
              <a href={`/doctors/${doctorSlots.user.username}`}>
                {doctorSlots.user.first_name} {doctorSlots.user.last_name}
              </a>
              <ArrowUpRightIcon className="ml-1 inline h-4 w-4 rotate-45 transition-all duration-100 group-hover:rotate-0" />
            </h2>
            <p className="text-sm">
              {doctorSlots?.specialties?.map((j) => j.name).join(", ")}
            </p>
          </div>
        </div>
        <div className="px-5">
          {/* Date Navigation */}
          <div className="my-5 flex items-center justify-between">
            <Button
              onClick={() => navigateDate(-1)}
              disabled={!isWithinNextWeek(addDays(selectedDate, -1))}
            >
              <ChevronLeftIcon className="h-6 w-6" />
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
              <ChevronRightIcon className="h-6 w-6" />
            </Button>
          </div>

          {/* Time Slots */}
          <div className="mt-4 grid grid-cols-3 gap-4 ">
            {isLoading ? (
              <LoadingComponent />
            ) : (
              doctorSlots?.appointment_slots?.map((slot, index) => (
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
        <div className="grid grid-cols-2 items-center gap-2 p-5 text-center">
          <div className="text-xl font-semibold text-primary">
            Cost: {doctorSlots.cost} {doctorSlots.currency}
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
