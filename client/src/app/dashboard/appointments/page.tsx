"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppointmentStore } from "@/store/useAppointmentStore";
import AppointmentCard from "@/components/appointments/appointment-card";
import LoadingComponent from "@/components/common/loading";
import { Appointment } from "@/types/appointment";

// Import dayjs and its plugins
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone.js";
import utc from "dayjs/plugin/utc.js";
dayjs.extend(utc);
dayjs.extend(timezone);

const localTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

const AppointmentsPage: React.FC = () => {
  // State to manage active tab and appointments
  const [activeTab, setActiveTab] = useState("today");
  const { appointments, fetchAppointments } = useAppointmentStore();

  // State to manage appointments categorized by today, upcoming, and history
  const [todayAppointments, setTodayAppointments] = useState<Appointment[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<
    Appointment[]
  >([]);
  const [historyAppointments, setHistoryAppointments] = useState<Appointment[]>(
    [],
  );

  // Fetch appointments on component mount
  useEffect(() => {
    fetchAppointments();
  }, []);

  // Categorize appointments based on date
  useEffect(() => {
    if (appointments && appointments.length > 0) {
      const todayAppointments = appointments.filter((appointment) =>
        dayjs(appointment.date).tz(localTimezone).isSame(dayjs(), "day"),
      );

      const upcomingAppointments = appointments.filter((appointment) =>
        dayjs(appointment.date).tz(localTimezone).isAfter(dayjs(), "day"),
      );

      const historyAppointments = appointments.filter((appointment) =>
        dayjs(appointment.date).tz(localTimezone).isBefore(dayjs(), "day"),
      );

      setTodayAppointments(todayAppointments);
      setUpcomingAppointments(upcomingAppointments);
      setHistoryAppointments(historyAppointments);
    }
  }, [appointments]);

  // Show loading component when fetching appointments
  if (!appointments) return <LoadingComponent />;

  return (
    <section className="container mb-8 space-y-4 px-0">
      <h1 className="py-8 text-center text-3xl font-medium">Appointments</h1>
      <Tabs defaultValue="today" className="!mt-0 w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger className="text-xs sm:text-sm" value="today">
            Today
          </TabsTrigger>
          <TabsTrigger className="text-xs sm:text-sm" value="upcoming">
            Upcoming
          </TabsTrigger>
          <TabsTrigger className="text-xs sm:text-sm" value="history">
            History
          </TabsTrigger>
          <TabsTrigger
            className="text-xs sm:text-sm"
            value="all"
            data-testid="all-tab-button"
          >
            All
          </TabsTrigger>
        </TabsList>
        {/* Tab content for today's appointments */}
        <TabsContent value="today" className="[&>div]:border-none">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">
                Today&rsquo;s appointments
              </CardTitle>
              <CardDescription className="text-center">
                Here are your appointments for today.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {todayAppointments.map((appointment, idx) => (
                  <AppointmentCard key={idx} appointment={appointment} />
                ))}
                {todayAppointments.length === 0 && (
                  <div className="text-left">
                    <p>You have no appointments today.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        {/* Tab content for upcoming appointments */}
        <TabsContent value="upcoming" className="[&>div]:border-none">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">
                Upcoming appointments
              </CardTitle>
              <CardDescription className="text-center">
                Here are your upcoming appointments.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {upcomingAppointments.map((appointment, idx) => (
                  <AppointmentCard key={idx} appointment={appointment} />
                ))}
                {upcomingAppointments.length === 0 && (
                  <div className="text-left">
                    <p>You have no upcoming appointments.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        {/* Tab content for history appointments */}
        <TabsContent value="history" className="[&>div]:border-none">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">
                History appointments
              </CardTitle>
              <CardDescription className="text-center">
                Here are your history appointments.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {historyAppointments.map((appointment, idx) => (
                  <AppointmentCard key={idx} appointment={appointment} />
                ))}
                {historyAppointments.length === 0 && (
                  <div className="text-left">
                    <p>You have no history appointments.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        {/* Tab content for all appointments */}
        <TabsContent value="all" className="[&>div]:border-none">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">All appointments</CardTitle>
              <CardDescription className="text-center">
                Here are all your appointments.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {appointments.map((appointment, idx) => (
                  <AppointmentCard key={idx} appointment={appointment} />
                ))}
                {appointments.length === 0 && (
                  <div className="text-left">
                    <p>You have no appointments.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default AppointmentsPage;
