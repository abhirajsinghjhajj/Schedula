"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { ModernNavbar } from "@/components/ModernNavbar"
import { ModernFooter } from "@/components/ModernFooter"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { doctorsAPI, type Doctor } from "@/lib/api"
import { Star, MapPin, Calendar, Clock, Video, Phone, Building, Award, Users } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function DoctorProfilePage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [doctor, setDoctor] = useState<Doctor | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      loadDoctor(params.id as string)
    }
  }, [params.id])

  const loadDoctor = async (id: string) => {
    try {
      const doctorData = await doctorsAPI.getById(id)
      setDoctor(doctorData)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load doctor profile",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleBookAppointment = (consultationType: string) => {
    if (!doctor) return
    router.push(`/booking/${doctor.id}?type=${consultationType}`)
  }

  if (isLoading) {
    return (
      <ProtectedRoute allowedRoles={["patient"]}>
        {/* CHANGED: Using theme-aware background and colors */}
        <div className="min-h-screen bg-background">
          <ModernNavbar />
          <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading doctor profile...</p>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  if (!doctor) {
    return (
      <ProtectedRoute allowedRoles={["patient"]}>
        {/* CHANGED: Using theme-aware background and colors */}
        <div className="min-h-screen bg-background">
          <ModernNavbar />
          <div className="max-w-4xl mx-auto px-4 py-8">
            <Card className="text-center py-12 bg-card">
              <CardContent>
                <h3 className="text-xl font-semibold text-foreground mb-2">Doctor not found</h3>
                <p className="text-muted-foreground">The doctor profile you're looking for doesn't exist.</p>
                <Button className="mt-4" onClick={() => router.push("/find-doctors")}>
                  Back to Search
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute allowedRoles={["patient"]}>
      {/* CHANGED: Using theme-aware background */}
      <div className="min-h-screen bg-background">
        <ModernNavbar />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Doctor Header */}
          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-start space-y-6 md:space-y-0 md:space-x-8">
                <img
                  src={doctor.image || "/placeholder.svg"}
                  alt={doctor.name}
                  className="w-32 h-32 rounded-full object-cover mx-auto md:mx-0"
                />
                <div className="flex-1 text-center md:text-left">
                  {/* CHANGED: Using theme-aware text and accent colors */}
                  <h1 className="text-3xl font-bold text-foreground mb-2">{doctor.name}</h1>
                  <p className="text-xl text-primary font-semibold mb-2">{doctor.specialty}</p>
                  <p className="text-muted-foreground mb-4">{doctor.qualifications}</p>

                  <div className="flex flex-wrap justify-center md:justify-start gap-x-4 gap-y-2 mb-4 text-muted-foreground">
                    <div className="flex items-center">
                      <Star className="w-5 h-5 text-yellow-400 fill-current mr-1" />
                      <span className="font-semibold text-foreground">{doctor.rating}</span>
                      <span className="ml-1">({doctor.reviewCount} reviews)</span>
                    </div>
                    <div className="flex items-center">
                      <Award className="w-5 h-5 mr-1" />
                      {doctor.experience} years experience
                    </div>
                    <div className="flex items-center">
                      <Users className="w-5 h-5 mr-1" />
                      {doctor.reviewCount}+ patients treated
                    </div>
                  </div>

                  <div className="flex items-center justify-center md:justify-start text-muted-foreground mb-6">
                    <MapPin className="w-5 h-5 mr-2" />
                    {doctor.clinicAddress}
                  </div>

                  <div className="flex flex-wrap justify-center md:justify-start gap-2">
                    {doctor.consultationType?.map((type) => (
                      <Badge key={type} variant="secondary">
                        {type === "clinic" && <Building className="w-3 h-3 mr-1" />}
                        {type === "video" && <Video className="w-3 h-3 mr-1" />}
                        {type === "call" && <Phone className="w-3 h-3 mr-1" />}
                        {type.charAt(0).toUpperCase() + type.slice(1)} Available
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="about" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="about">About</TabsTrigger>
                  <TabsTrigger value="availability">Availability</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>

                <TabsContent value="about" className="mt-6 space-y-6">
                  <Card>
                    <CardHeader><CardTitle>About Dr. {doctor.name.split(" ").pop()}</CardTitle></CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed">{doctor.about}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader><CardTitle>Qualifications & Experience</CardTitle></CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-foreground">Education</h4>
                        <p className="text-muted-foreground">{doctor.qualifications}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">Experience</h4>
                        <p className="text-muted-foreground">{doctor.experience} years in {doctor.specialty}</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="availability" className="mt-6 space-y-6">
                  <Card>
                    <CardHeader><CardTitle>Clinic Availability</CardTitle></CardHeader>
                    <CardContent className="space-y-2">
                      {doctor.availability?.clinic?.map((day) => (
                        <div key={day} className="flex justify-between items-center py-2 border-b">
                          <span className="font-medium text-foreground">{day}</span>
                          {/* ...time slots... */}
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader><CardTitle>Online Availability</CardTitle></CardHeader>
                    <CardContent className="space-y-2">
                      {doctor.availability?.online?.map((day) => (
                        <div key={day} className="flex justify-between items-center py-2 border-b">
                          <span className="font-medium text-foreground">{day}</span>
                          {/* ...time slots... */}
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* ... Reviews Tab Content ... */}
              </Tabs>
            </div>

            {/* Booking Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader><CardTitle>Book Appointment</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  {/* IMPROVEMENT: Replaced custom divs with styled Cards for better consistency */}
                  {doctor.consultationType?.includes("clinic") && (
                    <Card className="p-4 border-l-4 border-primary">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center font-medium text-foreground">
                          <Building className="w-5 h-5 mr-2 text-primary" />
                          Clinic Visit
                        </div>
                        <span className="font-semibold text-primary">${doctor.consultationFee}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">In-person consultation at clinic</p>
                      <Button className="w-full" onClick={() => handleBookAppointment("clinic")}>
                        Book Clinic Visit
                      </Button>
                    </Card>
                  )}
                  {doctor.consultationType?.includes("video") && (
                    <Card className="p-4 border-l-4 border-primary">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center font-medium text-foreground">
                          <Video className="w-5 h-5 mr-2 text-primary" />
                          Video Call
                        </div>
                        <span className="font-semibold text-primary">${doctor.videoConsultationFee}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">Online video consultation</p>
                      <Button className="w-full" onClick={() => handleBookAppointment("video")}>
                        Book Video Call
                      </Button>
                    </Card>
                  )}
                  {doctor.consultationType?.includes("call") && (
                    <Card className="p-4 border-l-4 border-primary">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center font-medium text-foreground">
                          <Phone className="w-5 h-5 mr-2 text-primary" />
                          Phone Call
                        </div>
                        <span className="font-semibold text-primary">${doctor.callConsultationFee}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">Audio consultation via phone</p>
                      <Button className="w-full" onClick={() => handleBookAppointment("call")}>
                        Book Phone Call
                      </Button>
                    </Card>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>Quick Info</CardTitle></CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-center"><Clock className="w-4 h-4 mr-2" />Response time: Within 2 hours</div>
                  <div className="flex items-center"><Calendar className="w-4 h-4 mr-2" />Next available: Today</div>
                  <div className="flex items-center"><Users className="w-4 h-4 mr-2" />{doctor.reviewCount}+ patients treated</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <ModernFooter />
      </div>
    </ProtectedRoute>
  )
}