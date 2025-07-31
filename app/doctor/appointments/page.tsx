"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { appointmentsAPI, type Appointment } from "@/lib/api";
import { Calendar, Clock, User, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ModernFooter } from "@/components/ModernFooter";

export default function DoctorAppointmentsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // ... (loadAppointments and updateAppointmentStatus logic is correct, no changes needed)
  useEffect(() => {
    if (user) {
      loadAppointments();
    }
  }, [user]);

  const loadAppointments = async () => {
    // ...
  };

  const updateAppointmentStatus = async (appointmentId: string, status: Appointment["status"]) => {
    // ...
  };
  
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

  const groupAppointmentsByDate = (appointments: Appointment[]) => {
    const grouped: { [key: string]: Appointment[] } = {};
    appointments.forEach((appointment) => {
      const date = appointment.date;
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(appointment);
    });
    return grouped;
  };

  const groupedAppointments = groupAppointmentsByDate(appointments);

  return (
    <ProtectedRoute allowedRoles={["doctor"]}>
      {/* CHANGED: Replaced hardcoded background with theme's 'background' color */}
      <div className="min-h-screen bg-background">
        <Navbar />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            {/* CHANGED: Using theme-aware text colors */}
            <h1 className="text-4xl font-bold text-foreground mb-4">My Appointments</h1>
            <p className="text-muted-foreground">Manage your patient appointments</p>
          </div>

          {isLoading ? (
            // IMPROVEMENT: Added a visual spinner for a better loading experience
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading appointments...</p>
            </div>
          ) : appointments.length === 0 ? (
            <Card className="text-center py-12 bg-card">
              <CardContent>
                {/* CHANGED: Icon uses theme's muted-foreground color */}
                <Calendar className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                {/* CHANGED: Using theme-aware text colors */}
                <h3 className="text-xl font-semibold text-foreground mb-2">No Appointments</h3>
                <p className="text-muted-foreground">You don't have any appointments scheduled yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-8">
              {Object.entries(groupedAppointments).map(([date, dayAppointments]) => (
                <div key={date}>
                  <h2 className="text-2xl font-bold text-foreground mb-4">
                    {new Date(date).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {dayAppointments.map((appointment) => (
                      <Card key={appointment.id} className="hover:shadow-xl transition-shadow bg-card">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg flex items-center">
                              <User className="w-5 h-5 mr-2" />
                              {appointment.patientName}
                            </CardTitle>
                            {/* IMPROVEMENT: Using the themed Badge component with variants */}
                            <Badge
                              variant={getStatusBadgeVariant(appointment.status)}
                              className="capitalize"
                            >
                              {appointment.status}
                            </Badge>
                          </div>
                          <CardDescription className="flex items-center pt-1">
                            <Clock className="w-4 h-4 mr-2" />
                            {appointment.time}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {appointment.status === "pending" && (
                              <div className="flex space-x-2">
                                <Button
                                  size="sm"
                                  onClick={() => updateAppointmentStatus(appointment.id, "confirmed")}
                                  className="flex-1"
                                >
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Confirm
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateAppointmentStatus(appointment.id, "cancelled")}
                                  className="flex-1"
                                >
                                  <XCircle className="w-4 h-4 mr-2" />
                                  Cancel
                                </Button>
                              </div>
                            )}

                            {appointment.status === "confirmed" && (
                              <Button
                                size="sm"
                                onClick={() => updateAppointmentStatus(appointment.id, "completed")}
                                className="w-full"
                              >
                                Mark as Completed
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <ModernFooter />
      </div>
    </ProtectedRoute>
  );
}