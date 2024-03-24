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

export default function AppointmentCard({
  appointment,
  className,
}: {
  appointment: Appointment;
  className?: string;
}) {
  const router = useRouter();
  const { selectConversation } = useMessagesStore();

  const handleJoinConversation = () => {
    selectConversation(appointment.conversation);
    router.push(`/dashboard/messages`);
  };

  if (!appointment) return null;
  return (
    <Card key={appointment.id} className={cn("", className)}>
      <CardHeader>
        <CardTitle>
          {appointment.patient.first_name} {appointment.patient.last_name}
        </CardTitle>
        <CardDescription>
          {appointment.date} {appointment.time} - 1 Hr
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Purpose: {appointment.purpose}</p>
      </CardContent>
      <CardFooter>
        <Button onClick={handleJoinConversation}>Join</Button>
      </CardFooter>
    </Card>
  );
}
