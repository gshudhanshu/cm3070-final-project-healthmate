import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

import { Appointment } from "@/types/appointment";
import { cn } from "@/lib/utils";
import { useMessagesStore } from "@/store/useMessageStore";
import { useAuthStore } from "@/store/useAuthStore";

// Import dayjs and its plugins
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone.js";
import utc from "dayjs/plugin/utc.js";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrAfter);

export default function AppointmentCard({
  appointment,
  className,
}: {
  appointment: Appointment;
  className?: string;
}) {
  const router = useRouter();
  const { selectConversation } = useMessagesStore();
  const { user } = useAuthStore();

  // Function to handle joining conversation
  const handleJoinConversation = () => {
    selectConversation(appointment.conversation);
    router.push(`/dashboard/messages`);
  };

  // If appointment is null, return null
  if (!appointment) return null;
  return (
    <Card key={appointment.id} className={cn("", className)}>
      <CardHeader>
        {/* Rendering patient or doctor name based on user account type */}
        <CardTitle>
          {user?.account_type === "doctor" &&
            appointment.patient.first_name +
              " " +
              appointment.patient.last_name}
          {user?.account_type === "patient" &&
            appointment.doctor.user.first_name +
              " " +
              appointment.doctor.user.last_name}
        </CardTitle>
        {/* Rendering formatted date and time */}
        <CardDescription>
          {dayjs(appointment.datetime_utc)
            .tz(dayjs.tz.guess())
            .format("MMM D, YYYY")}{" "}
          {dayjs(appointment.datetime_utc)
            .tz(dayjs.tz.guess())
            .format("h:mm A")}{" "}
          - 1 Hr
        </CardDescription>
      </CardHeader>
      {/* Rendering appointment purpose */}
      <CardContent>
        <p>Purpose: {appointment.purpose}</p>
      </CardContent>
      <CardFooter>
        {/* Join button to join conversation */}
        <Button onClick={handleJoinConversation}>Join</Button>
      </CardFooter>
    </Card>
  );
}
