import { useEffect, useState } from "react";
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

interface SlotsResponse {
  slots: string[];
}

const AppointmentModal = ({}) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [slots, setSlots] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const selectSlot = (slot: string) => {
    setSelectedSlot(slot);
  };

  useEffect(() => {
    const fetchSlots = async () => {
      setIsLoading(true);
      try {
        // Replace '/api/slots' with your actual API endpoint
        // let response = await fetch(
        //   `/api/slots?date=${formatDate(selectedDate)}`,
        // );
        // const data: SlotsResponse = await response.json();
        // setSlots(data.slots);
        setSlots(availableSlots);
      } catch (error) {
        console.error("Failed to fetch slots:", error);
        // Handle errors as appropriate for your application
      }
      setIsLoading(false);
    };

    if (isWithinNextWeek(selectedDate)) {
      fetchSlots();
    }
  }, [selectedDate]);

  const navigateDate = (days: number) => {
    const newDate = addDays(selectedDate, days);
    if (isWithinNextWeek(newDate)) {
      setSelectedDate(newDate);
    }
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
              <p>Loading...</p>
            ) : (
              slots.map((slot, index) => (
                <Button
                  key={index}
                  variant={selectedSlot === slot ? "default" : "secondary"}
                  onClick={() => selectSlot(slot)}
                  disabled={isDateInPast(selectedDate)}
                >
                  {slot}
                </Button>
              ))
            )}
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
