"use client";

import { useCallback, useMemo, useState } from "react";
import { Calendar, momentLocalizer, View, Event, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { XCircle, User, Clock, Calendar as CalendarIcon } from "lucide-react";
import { type Appointment } from "@/lib/api";

const localizer = momentLocalizer(moment);

interface AppointmentCalendarProps {
  appointments: Appointment[];
  onEventDrop: (appointment: Appointment, newDate: Date) => void;
  onEventCancel: (appointment: Appointment) => void;
  getStatusBadgeVariant: (status: string) => "default" | "secondary" | "destructive" | "outline";
}

interface CalendarEvent extends Event {
  appointment: Appointment;
}

export default function AppointmentCalendar({
  appointments,
  onEventDrop,
  onEventCancel,
  getStatusBadgeVariant,
}: AppointmentCalendarProps) {
  const [currentView, setCurrentView] = useState<View>('week');
  const [currentDate, setCurrentDate] = useState(new Date());

  // Convert appointments to calendar events
  const events: CalendarEvent[] = useMemo(() => {
    return appointments.map((appointment) => {
      const [hours, minutes] = appointment.time.split(':').map(Number);
      const eventDate = new Date(appointment.date);
      eventDate.setHours(hours, minutes, 0, 0);
      
      const endDate = new Date(eventDate);
      endDate.setHours(hours + 1, minutes, 0, 0); // Default 1 hour duration

      return {
        title: `${appointment.patientName} - ${appointment.consultationType || 'Appointment'}`,
        start: eventDate,
        end: endDate,
        appointment,
      };
    });
  }, [appointments]);

  // Handle event drop (reschedule)
  const handleEventDrop = useCallback(
    ({ event, start }: { event: CalendarEvent; start: Date }) => {
      onEventDrop(event.appointment, start);
    },
    [onEventDrop]
  );

  // Handle view change
  const handleViewChange = useCallback((newView: View) => {
    setCurrentView(newView);
  }, []);

  // Handle date change
  const handleNavigate = useCallback((newDate: Date) => {
    setCurrentDate(newDate);
  }, []);

  // Custom event component with tooltip and cancel button
  const EventComponent = useCallback(
    ({ event }: { event: CalendarEvent }) => {
      const { appointment } = event;
      
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="h-full w-full p-1">
                <div className="h-full w-full bg-primary/10 border border-primary/20 rounded p-2 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium truncate">{appointment.patientName}</span>
                    <Badge
                      variant={getStatusBadgeVariant(appointment.status)}
                      className="text-xs px-1 py-0 h-4"
                    >
                      {appointment.status}
                    </Badge>
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground mb-1">
                    <Clock className="w-3 h-3 mr-1" />
                    {appointment.time}
                  </div>
                  {appointment.consultationType && (
                    <div className="text-xs text-muted-foreground truncate">
                      {appointment.consultationType}
                    </div>
                  )}
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-xs">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span className="font-medium">{appointment.patientName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4" />
                  <span>{new Date(appointment.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{appointment.time}</span>
                </div>
                {appointment.consultationType && (
                  <div className="text-sm">
                    <strong>Type:</strong> {appointment.consultationType}
                  </div>
                )}
                {appointment.symptoms && (
                  <div className="text-sm">
                    <strong>Symptoms:</strong> {appointment.symptoms}
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Badge variant={getStatusBadgeVariant(appointment.status)}>
                    {appointment.status}
                  </Badge>
                </div>
                {appointment.status !== 'cancelled' && (
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventCancel(appointment);
                    }}
                    className="w-full mt-2"
                  >
                    <XCircle className="w-3 h-3 mr-1" />
                    Cancel
                  </Button>
                )}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
    [getStatusBadgeVariant, onEventCancel]
  );

  // Custom toolbar with view options
  const CustomToolbar = useCallback(
    (toolbar: any) => {
      const goToToday = () => {
        const today = new Date();
        setCurrentDate(today);
        toolbar.onNavigate('TODAY');
      };

      const goToPrevious = () => {
        toolbar.onNavigate('PREV');
      };

      const goToNext = () => {
        toolbar.onNavigate('NEXT');
      };

      const changeView = (view: View) => {
        setCurrentView(view);
        toolbar.onView(view);
      };

      return (
        <div className="flex items-center justify-between mb-4 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={goToToday}>
              Today
            </Button>
            <Button size="sm" variant="outline" onClick={goToPrevious}>
              Previous
            </Button>
            <Button size="sm" variant="outline" onClick={goToNext}>
              Next
            </Button>
          </div>
          
          <div className="text-lg font-semibold">
            {toolbar.label}
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant={toolbar.view === 'month' ? 'default' : 'outline'}
              onClick={() => changeView('month')}
            >
              Month
            </Button>
            <Button
              size="sm"
              variant={toolbar.view === 'week' ? 'default' : 'outline'}
              onClick={() => changeView('week')}
            >
              Week
            </Button>
            <Button
              size="sm"
              variant={toolbar.view === 'day' ? 'default' : 'outline'}
              onClick={() => changeView('day')}
            >
              Day
            </Button>
            <Button
              size="sm"
              variant={toolbar.view === 'agenda' ? 'default' : 'outline'}
              onClick={() => changeView('agenda')}
            >
              Agenda
            </Button>
          </div>
        </div>
      );
    },
    []
  );

  // Define available views
  const views = useMemo(() => ({
    month: true,
    week: true,
    day: true,
    agenda: true,
  }), []);

  return (
    <div className="h-[600px]">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
        onEventDrop={handleEventDrop}
        onView={handleViewChange}
        onNavigate={handleNavigate}
        view={currentView}
        date={currentDate}
        components={{
          event: EventComponent,
          toolbar: CustomToolbar,
        }}
        selectable
        resizable
        draggableAccessor={() => true}
        defaultView="week"
        views={views}
        step={60}
        timeslots={1}
        className="bg-background text-foreground"
        eventPropGetter={(event) => {
          const { appointment } = event as CalendarEvent;
          const status = appointment.status;
          
          let style: React.CSSProperties = {};
          
          switch (status) {
            case 'confirmed':
              style = { backgroundColor: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))' };
              break;
            case 'pending':
              style = { backgroundColor: 'hsl(var(--secondary))', color: 'hsl(var(--secondary-foreground))' };
              break;
            case 'cancelled':
              style = { backgroundColor: 'hsl(var(--destructive))', color: 'hsl(var(--destructive-foreground))' };
              break;
            case 'completed':
              style = { backgroundColor: 'hsl(var(--muted))', color: 'hsl(var(--muted-foreground))' };
              break;
            default:
              style = { backgroundColor: 'hsl(var(--secondary))', color: 'hsl(var(--secondary-foreground))' };
          }
          
          return { style };
        }}
      />
    </div>
  );
}
