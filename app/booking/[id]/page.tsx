"use client"

import { useEffect, useState, useMemo } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { ModernNavbar } from "@/components/ModernNavbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { appointmentsAPI, doctorsAPI, type Doctor } from "@/lib/api"
import { Calendar, Clock, Video, Phone, Building, CreditCard, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function BookingPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const { toast } = useToast()

  const [doctor, setDoctor] = useState<Doctor | null>(null)
  const [consultationType, setConsultationType] = useState(searchParams.get("type") || "clinic")
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [symptoms, setSymptoms] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isBooking, setIsBooking] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const [bookingComplete, setBookingComplete] = useState(false)

  const availableDates = useMemo(() => {
    // ... (logic is correct, no changes needed)
  }, [doctor, consultationType]);

  // ... (useEffect and loadDoctor logic are correct, no changes needed)

  const getConsultationFee = () => {
    // ... (logic is correct, no changes needed)
  };

  const handleBookAppointment = async () => {
    // ... (logic is correct, no changes needed)
  };

  const handlePayment = async () => {
    // ... (logic is correct, no changes needed)
  };

  if (isLoading) return null; // Let the loading.tsx file handle the initial loading UI

  if (!doctor) {
    return (
      <ProtectedRoute allowedRoles={["patient"]}>
        {/* CHANGED: Using theme-aware background and text colors */}
        <div className="min-h-screen bg-background">
          <ModernNavbar />
          <div className="max-w-4xl mx-auto px-4 py-8">
            <Card className="text-center py-12 bg-card">
              <CardContent>
                <h3 className="text-xl font-semibold text-foreground mb-2">Doctor not found</h3>
                <Button onClick={() => router.push("/find-doctors")}>Back to Search</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  if (bookingComplete) {
    return (
      <ProtectedRoute allowedRoles={["patient"]}>
        {/* CHANGED: Using theme-aware background and text colors */}
        <div className="min-h-screen bg-background">
          <ModernNavbar />
          <div className="max-w-2xl mx-auto px-4 py-8">
            <Card className="text-center py-12 bg-card">
              <CardContent>
                {/* CHANGED: Icon uses theme's primary color */}
                <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-foreground mb-4">Booking Confirmed!</h2>
                <p className="text-muted-foreground mb-6">
                  Your appointment with Dr. {doctor.name} has been successfully booked.
                </p>
                {/* CHANGED: Summary box uses theme's muted color */}
                <div className="bg-muted p-4 rounded-lg mb-6 text-muted-foreground">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Date:</span>
                      <span className="font-medium text-foreground">
                        {new Date(selectedDate).toLocaleDateString()}
                      </span>
                    </div>
                    {/* ... other summary items ... */}
                  </div>
                </div>
                <div className="space-x-4">
                  <Button onClick={() => router.push("/appointments")}>View Appointments</Button>
                  <Button variant="outline" onClick={() => router.push("/")}>
                    Back to Home
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute allowedRoles={["patient"]}>
      {/* CHANGED: Using theme-aware background and text colors */}
      <div className="min-h-screen bg-background">
        <ModernNavbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Book Appointment</h1>
            <p className="text-muted-foreground">Schedule your consultation with Dr. {doctor.name}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {!showPayment ? (
                <>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <img src={doctor.image || "/placeholder.svg"} alt={doctor.name} className="w-16 h-16 rounded-full object-cover" />
                        <div>
                          <h3 className="text-xl font-semibold text-foreground">{doctor.name}</h3>
                          {/* CHANGED: Specialty text uses theme's primary color */}
                          <p className="text-primary">{doctor.specialty}</p>
                          <div className="flex items-center mt-1 text-muted-foreground">
                            {/* ... icons ... */}
                            <span className="text-sm capitalize">{consultationType} Consultation</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* IMPROVEMENT: Replaced buttons with a ToggleGroup for better semantics and theme consistency */}
                  <Card>
                    <CardHeader><CardTitle className="flex items-center"><Calendar className="w-5 h-5 mr-2" />Select Date</CardTitle></CardHeader>
                    <CardContent>
                      <ToggleGroup type="single" value={selectedDate} onValueChange={(value) => value && setSelectedDate(value)} className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {availableDates.map((dateOption) => (
                          <ToggleGroupItem key={dateOption.date} value={dateOption.date} className="h-auto flex-col py-3 px-2">
                            <div className="text-sm font-medium">{dateOption.display}</div>
                            <div className="text-xs">{dateOption.dayName}</div>
                          </ToggleGroupItem>
                        ))}
                      </ToggleGroup>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader><CardTitle className="flex items-center"><Clock className="w-5 h-5 mr-2" />Select Time</CardTitle></CardHeader>
                    <CardContent>
                      <ToggleGroup type="single" value={selectedTime} onValueChange={(value) => value && setSelectedTime(value)} className="grid grid-cols-3 md:grid-cols-6 gap-3">
                        {doctor.timeSlots?.map((time) => (
                          <ToggleGroupItem key={time} value={time} className="p-2">
                            {time}
                          </ToggleGroupItem>
                        ))}
                      </ToggleGroup>
                    </CardContent>
                  </Card>
                  
                  {/* ... Symptoms Card ... */}

                  <Button className="w-full" size="lg" onClick={handleBookAppointment} disabled={!selectedDate || !selectedTime}>
                    Proceed to Payment
                  </Button>
                </>
              ) : (
                <Card>
                    {/* ... Payment Form ... */}
                </Card>
              )}
            </div>

            <div>
              <Card className="sticky top-24 bg-card">
                <CardHeader><CardTitle>Booking Summary</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3 text-sm">
                    {/* ... summary items with themed text ... */}
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-foreground">Total:</span>
                      {/* CHANGED: Total amount uses theme's primary color */}
                      <span className="text-2xl font-bold text-primary">${getConsultationFee()}</span>
                    </div>
                  </div>

                  {consultationType !== "clinic" && (
                    // IMPROVEMENT: Replaced custom div with the themed Alert component
                    <Alert>
                      <AlertDescription>
                        <strong>Note:</strong> You will receive a {consultationType === "video" ? "video call" : "phone call"} link/number before your appointment.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}