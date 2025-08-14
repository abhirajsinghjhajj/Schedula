"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { appointmentsAPI, type Appointment } from "@/lib/api";
import { Calendar, Clock, User, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ModernFooter } from "@/components/ModernFooter";
import AppointmentCalendar from "@/components/AppointmentCalendar";

export default function DoctorCalendarPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [actionType, setActionType] = useState<'reschedule' | 'cancel' | null>(null);
  const [newDateTime, setNewDateTime] = useState<{ date: string; time: string } | null>(null);

  useEffect(() => {
    if (user) {
      loadAppointments();
    }
  }, [user]);

  const loadAppointments = async () => {
    try {
      setIsLoading(true);
      if (!user) return;
      const data = await appointmentsAPI.getByDoctorId(user.id);
      setAppointments(data);
    } catch (e) {
      toast({ title: "Error", description: "Failed to load appointments", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEventDrop = useCallback((appointment: Appointment, newDate: Date) => {
    setSelectedAppointment(appointment);
    setNewDateTime({
      date: newDate.toISOString().split('T')[0],
      time: newDate.toTimeString().slice(0, 5)
    });
    setActionType('reschedule');
    setShowConfirmDialog(true);
  }, []);

  const handleEventCancel = useCallback((appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setActionType('cancel');
    setShowConfirmDialog(true);
  }, []);

  const confirmAction = async () => {
    if (!selectedAppointment) return;

    try {
      if (actionType === 'reschedule' && newDateTime) {
        // Update appointment with new date/time
        const updated = await appointmentsAPI.updateDateTime(selectedAppointment.id, newDateTime.date, newDateTime.time);
        setAppointments(prev => prev.map(a => a.id === selectedAppointment.id ? updated : a));
        toast({ title: "Success", description: "Appointment rescheduled successfully" });
      } else if (actionType === 'cancel') {
        // Cancel appointment
        const updated = await appointmentsAPI.updateStatus(selectedAppointment.id, 'cancelled');
        setAppointments(prev => prev.map(a => a.id === selectedAppointment.id ? updated : a));
        toast({ title: "Success", description: "Appointment cancelled successfully" });
      }
      
      setShowConfirmDialog(false);
      setSelectedAppointment(null);
      setActionType(null);
      setNewDateTime(null);
    } catch (e) {
      toast({ title: "Error", description: "Failed to update appointment", variant: "destructive" });
    }
  };

  const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case "confirmed":
        return "default";
      case "pending":
        return "secondary";
      case "cancelled":
        return "destructive";
      case "completed":
        return "outline";
      default:
        return "secondary";
    }
  };

  return (
    <ProtectedRoute allowedRoles={["doctor"]}>
      <div className="min-h-screen bg-background">
        <Navbar />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">Appointment Calendar</h1>
            <p className="text-muted-foreground">Manage your appointments with drag & drop</p>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading calendar...</p>
            </div>
          ) : (
            <Card className="bg-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Appointment Schedule
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AppointmentCalendar
                  appointments={appointments}
                  onEventDrop={handleEventDrop}
                  onEventCancel={handleEventCancel}
                  getStatusBadgeVariant={getStatusBadgeVariant}
                />
              </CardContent>
            </Card>
          )}
        </div>

        {/* Confirmation Dialog */}
        <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-yellow-500" />
                Confirm Action
              </DialogTitle>
              <DialogDescription>
                {actionType === 'reschedule' && selectedAppointment && newDateTime && (
                  <>
                    Are you sure you want to reschedule the appointment with{" "}
                    <strong>{selectedAppointment.patientName}</strong> from{" "}
                    <strong>{selectedAppointment.date} at {selectedAppointment.time}</strong> to{" "}
                    <strong>{newDateTime.date} at {newDateTime.time}</strong>?
                  </>
                )}
                {actionType === 'cancel' && selectedAppointment && (
                  <>
                    Are you sure you want to cancel the appointment with{" "}
                    <strong>{selectedAppointment.patientName}</strong> on{" "}
                    <strong>{selectedAppointment.date} at {selectedAppointment.time}</strong>?
                  </>
                )}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
                Cancel
              </Button>
              <Button onClick={confirmAction}>
                {actionType === 'reschedule' ? 'Reschedule' : 'Cancel Appointment'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <ModernFooter />
      </div>
    </ProtectedRoute>
  );
}
