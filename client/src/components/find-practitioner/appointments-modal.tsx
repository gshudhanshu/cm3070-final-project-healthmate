import { useState } from "react";
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

// Define the shape of the slots data
interface Slots {
  [key: string]: string[];
}

// Mock data for available slots
const availableSlots: Slots = {
  "2024-01-21": [
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
    "5:00 PM",
    "6:00 PM",
  ],
  // ... other dates
};

// Helper to check if a date is in the past
const isDateInPast = (date: Date): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
};

const AppointmentModal = ({}) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Function to navigate to the next or previous day
  const navigateDate = (direction: number) => {
    setSelectedDate(
      new Date(selectedDate.setDate(selectedDate.getDate() + direction)),
    );
  };

  // Function to get the slots for the selected date
  const getSlotsForSelectedDate = (): string[] => {
    const dateKey = selectedDate.toISOString().split("T")[0];
    return availableSlots[dateKey] || [];
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button>Edit Profile</button>
      </DialogTrigger>

      <DialogContent className="m-0 gap-0 border-0 p-0">
        <DialogHeader className="rounded-t-lg bg-primary p-4 text-white">
          <DialogTitle className="text-center">Book an appointment</DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-center text-slate-600 dark:text-slate-400">
          {/* Doctor's Info */}
          <div className="flex flex-col items-center justify-between bg-slate-200 p-3 text-center">
            <h2 className="text-slate group w-full text-center text-xl font-semibold">
              Dr. Destin Roberts
              <ArrowUpRightIcon className="ml-1 inline h-4 w-4 rotate-45 transition-all duration-100 group-hover:rotate-0" />
            </h2>
            <p className="text-sm">Cardiology, Medicine - MD Cardiology</p>
          </div>
        </DialogDescription>
        <div className="px-5">
          {/* Date Navigation */}
          <div className="my-5 flex items-center justify-between">
            <button onClick={() => navigateDate(-1)}>
              <ChevronLeftIcon className="h-6 w-6" />
            </button>
            <span className="text-lg font-medium">
              {selectedDate.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </span>
            <button onClick={() => navigateDate(1)}>
              <ChevronRightIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Time Slots */}
          <div className="grid grid-cols-3 gap-2">
            {getSlotsForSelectedDate().map((time, index) => (
              <Button
                key={index}
                variant="secondary"
                className={`${
                  isDateInPast(selectedDate) ? "bg-primary" : "bg-slate-200"
                } px-4 py-2`}
                disabled={isDateInPast(selectedDate)}
              >
                {time}
              </Button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 items-center gap-2 p-5 text-center">
          <div className="text-xl font-semibold text-primary">Cost: Free</div>
          <Button onClick={() => console.log("Booking appointment...")}>
            Book Appointment
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentModal;
