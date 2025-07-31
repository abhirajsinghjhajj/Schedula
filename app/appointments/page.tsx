"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Navbar } from "@/components/Navbar";
import { ModernFooter } from "@/components/ModernFooter";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { appointmentsAPI, type Appointment } from "@/lib/api";
import { Calendar, Clock, User, Stethoscope } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { AppointmentActions } from "@/components/AppointmentActions";
import { useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type AppointmentStatusFilter = "all" | "pending" | "confirmed" | "cancelled" | "completed";

export default function AppointmentsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<AppointmentStatusFilter>("all");

  const loadAppointments = async () => {
    if (!user?.id) {
      setError("User not logged in. Please log in to view appointments.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const appointmentsData = await appointmentsAPI.getByPatientId(user.id);
      setAppointments(
        appointmentsData.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )
      );
    } catch (err) {
      console.error("Failed to load appointments:", err);
      setError("Failed to load appointments. Please try again.");
      toast({
        title: "Error",
        description: "Failed to load appointments.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadAppointments();
    }
  }, [user]);

  const filteredAppointments = appointments.filter((appointment) => {
    if (filter === "all") {
      return true;
    }
    return appointment.status === filter;
  });

  // IMPROVEMENT: This function maps a status to a pre-defined badge variant.
  // This is much cleaner and ensures theme consistency.
  const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case "confirmed":
        return "default"; // Will use the theme's primary color (Minty Green)
      case "pending":
        return "secondary"; // Will use the theme's secondary color (Slate)
      case "cancelled":
        return "destructive"; // Will use the theme's destructive color (Red)
      case "completed":
        return "outline"; // Will use the theme's outline style
      default:
        return "secondary";
    }
  };

  return (
    <ProtectedRoute allowedRoles={["patient"]}>
      {/* CHANGED: Replaced hardcoded gray background with theme's 'background' color. */}
      <div className="min-h-screen bg-background">
        <Navbar />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            {/* CHANGED: Using theme-aware text colors. */}
            <h1 className="text-4xl font-bold text-foreground mb-4">
              My Appointments
            </h1>
            <p className="text-muted-foreground">
              View and manage your upcoming and past appointments
            </p>
          </div>

          <div className="mb-6">
            <Tabs value={filter} onValueChange={(value) => setFilter(value as AppointmentStatusFilter)} className="w-full">
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5 h-auto">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
                <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {error && (
            <div className="text-center text-destructive mb-4">{error}</div>
          )}

          {isLoading ? (
            <div className="text-center text-muted-foreground py-12">
              Loading appointments...
            </div>
          ) : filteredAppointments.length === 0 ? (
            // CHANGED: Card now uses theme's 'card' background color.
            <Card className="text-center py-12 flex flex-col items-center justify-center space-y-4 bg-card shadow-lg rounded-lg">
              <CardContent className="flex flex-col items-center justify-center p-6">
                {/* CHANGED: Icon uses theme's 'primary' color. */}
                <Calendar className="w-20 h-20 text-primary mb-4" />
                {/* CHANGED: Text uses theme-aware colors. */}
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  {filter === "all" ? "No Appointments Yet!" : `No ${filter} Appointments`}
                </h3>
                <p className="text-muted-foreground mb-6 max-w-sm">
                  {filter === "all"
                    ? "It looks like you haven't booked any appointments. Start by finding a doctor that fits your needs."
                    : `There are no appointments with "${filter}" status.`}
                </p>
                {filter === "all" && (
                  // IMPROVEMENT: Removed hardcoded styles. The default Button is already styled by our theme.
                  <Button onClick={() => router.push("/find-doctors")} className="mt-4">
                    Find a Doctor
                  </Button>
                )}
                {filter !== "all" && (
                  <Button
                    onClick={() => setFilter("all")}
                    variant="outline"
                    className="mt-4"
                  >
                    Show All Appointments
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAppointments.map((appointment) => (
                <Card
                  key={appointment.id}
                  className="hover:shadow-xl transition-shadow bg-card" // Ensure card uses theme background
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center">
                        <User className="w-5 h-5 mr-2" />
                        {appointment.doctorName}
                      </CardTitle>
                      {/* IMPROVEMENT: Using the themed Badge component with variants instead of a custom function. */}
                      <Badge
                        variant={getStatusBadgeVariant(appointment.status)}
                        className="capitalize"
                      >
                        {appointment.status}
                      </Badge>
                    </div>
                    {/* CHANGED: Replaced hardcoded teal with muted-foreground color. */}
                    <CardDescription className="flex items-center text-muted-foreground pt-1">
                      <Stethoscope className="w-4 h-4 mr-2" />
                      {appointment.specialty}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {/* CHANGED: Text uses theme-aware muted-foreground color. */}
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4 mr-2" />
                        {new Date(appointment.date).toLocaleDateString(
                          "en-US",
                          {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="w-4 h-4 mr-2" />
                        {appointment.time}
                      </div>
                    </div>
                  </CardContent>
                  <div className="px-6 pb-4">
                    <AppointmentActions
                      appointmentId={appointment.id}
                      status={appointment.status}
                      doctorId={appointment.doctorId}
                      onAppointmentAction={loadAppointments}
                    />
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
        <ModernFooter />
      </div>
    </ProtectedRoute>
  );
}