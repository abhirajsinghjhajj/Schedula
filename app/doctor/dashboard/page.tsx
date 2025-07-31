"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { appointmentsAPI, type Appointment } from "@/lib/api";
import { Calendar, Users, Clock, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function DoctorDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  // ... (useEffect and loadAppointments logic is correct, no changes needed)
  useEffect(() => {
    //...
  }, [user]);

  const loadAppointments = async () => {
    //...
  };

  const todayAppointments = appointments.filter(
    (appointment) => appointment.date === new Date().toISOString().split("T")[0]
  );

  // IMPROVEMENT: This function maps a status to a pre-defined badge variant
  // for theme consistency.
  const getStatusBadgeVariant = (status: Appointment["status"]): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case "confirmed":
        return "default";
      case "pending":
        return "secondary";
      case "completed":
        return "outline";
      case "cancelled":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <ProtectedRoute allowedRoles={["doctor"]}>
      {/* CHANGED: Replaced hardcoded background with theme's 'background' color */}
      <div className="min-h-screen bg-background">
        <Navbar />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            {/* CHANGED: Using theme-aware text colors */}
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Welcome back, Dr. {user?.name?.split(" ")[1] || user?.name}
            </h1>
            <p className="text-muted-foreground text-lg">Here's your practice overview</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
                {/* CHANGED: Icon uses theme's 'primary' color */}
                <Calendar className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-xs text-muted-foreground">All time</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                {/* CHANGED: Icon uses theme's 'muted-foreground' color */}
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pending}</div>
                <p className="text-xs text-muted-foreground">Awaiting confirmation</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
                <Users className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.confirmed}</div>
                <p className="text-xs text-muted-foreground">Ready to see</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.completed}</div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>
          </div>

          {/* Today's Appointments */}
          <Card>
            <CardHeader>
              <CardTitle>Today's Appointments</CardTitle>
              <CardDescription>{todayAppointments.length} appointments scheduled for today</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8 text-muted-foreground">Loading appointments...</div>
              ) : todayAppointments.length === 0 ? (
                <div className="text-center py-8">
                  {/* CHANGED: Icon and text use theme's muted-foreground color */}
                  <Calendar className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No appointments scheduled for today</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {todayAppointments.map((appointment) => (
                    // CHANGED: List item uses theme's muted background color
                    <div
                      key={appointment.id}
                      className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        {/* IMPROVEMENT: Replaced custom div with the themed Avatar component */}
                        <Avatar>
                          <AvatarFallback className="bg-primary text-primary-foreground text-sm font-bold">
                            {appointment.patientName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          {/* CHANGED: Text uses theme-aware colors */}
                          <p className="font-medium text-foreground">{appointment.patientName}</p>
                          <p className="text-muted-foreground text-sm">{appointment.time}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        {/* IMPROVEMENT: Replaced span with the themed Badge component */}
                        <Badge
                          variant={getStatusBadgeVariant(appointment.status)}
                          className="capitalize"
                        >
                          {appointment.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}