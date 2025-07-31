"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ModernNavbar } from "@/components/ModernNavbar";
import { HeroSection } from "@/components/HeroSection";
import { SpecialtySlider } from "@/components/SpecialtySlider";
import { TestimonialSection } from "@/components/TestimonialSection";
import { ModernFooter } from "@/components/ModernFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { doctorsAPI, type Doctor } from "@/lib/api";
import { Search, MapPin, Star, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function HomePage() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  // ... (useEffect and other logic is correct, no changes needed)
  useEffect(() => {
    if (user?.role === "doctor") {
      router.push("/doctor/dashboard");
    } else {
      // For patients and logged-out users, load doctors for the homepage
      loadDoctors();
    }
  }, [user, router]);
  
  const loadDoctors = async () => {
    //...
  };

  const handleSearch = () => {
    //...
  };
  
  const handleSpecialtySelect = (specialty: string) => {
    router.push(`/find-doctors?specialty=${specialty}`);
  };

  const bookAppointment = (doctor: Doctor) => {
    router.push(`/booking/${doctor.id}`);
  };

  useEffect(() => {
    //...
  }, [searchTerm, selectedSpecialty, doctors]);


  // Logged-out users see the marketing/landing page content
  if (!user) {
    return (
      // CHANGED: Use a consistent background color from your theme
      <div className="bg-background">
        <ModernNavbar />
        <HeroSection />
        <SpecialtySlider title="Book Appointment in Clinic" onSpecialtySelect={handleSpecialtySelect} />
        <TestimonialSection />
        <ModernFooter />
      </div>
    );
  }

  // Logged-in patients see the dashboard/search functionality
  return (
    <ProtectedRoute allowedRoles={["patient"]}>
      {/* CHANGED: Use a consistent background color from your theme */}
      <div className="bg-background">
        <ModernNavbar />
        <HeroSection />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            {/* CHANGED: Using theme-aware text colors */}
            <h1 className="text-4xl font-bold text-foreground mb-4">Find & Book Appointments</h1>
            <p className="text-muted-foreground text-lg">Connect with qualified doctors in your area</p>
          </div>

          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search doctors or specialties..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="md:w-64">
                  <Select onValueChange={setSelectedSpecialty} defaultValue="all">
                    <SelectTrigger>
                      <SelectValue placeholder="All Specialties" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Specialties</SelectItem>
                      <SelectItem value="cardiology">Cardiology</SelectItem>
                      <SelectItem value="dermatology">Dermatology</SelectItem>
                      <SelectItem value="neurology">Neurology</SelectItem>
                      <SelectItem value="orthopedics">Orthopedics</SelectItem>
                      <SelectItem value="pediatrics">Pediatrics</SelectItem>
                      <SelectItem value="psychiatry">Psychiatry</SelectItem>
                      <SelectItem value="general medicine">General Medicine</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleSearch}>
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
              </div>
            </CardContent>
          </Card>

          {isLoading ? (
            <div className="text-center text-muted-foreground">Loading doctors...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDoctors.map((doctor) => (
                <Card key={doctor.id} className="hover:shadow-xl transition-shadow bg-card">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <img src={doctor.image || '/placeholder.svg'} alt={doctor.name} className="w-16 h-16 rounded-full object-cover" />
                      <div>
                        <CardTitle>{doctor.name}</CardTitle>
                        {/* CHANGED: Specialty uses theme's primary color */}
                        <CardDescription className="text-primary font-medium">{doctor.specialty}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      {/* CHANGED: Text uses theme's muted-foreground color */}
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Star className="w-4 h-4 mr-2 text-yellow-400 fill-current" />
                        {doctor.qualifications}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4 mr-2" />
                        {doctor.experience} years experience
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4 mr-2" />
                        {doctor.clinicAddress}
                      </div>
                    </div>
                    <Button className="w-full" onClick={() => bookAppointment(doctor)}>
                      Book Appointment
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {filteredDoctors.length === 0 && !isLoading && (
            <div className="text-center text-muted-foreground py-8">
              <p className="text-lg">No doctors found matching your criteria.</p>
            </div>
          )}
        </div>

        <TestimonialSection />
        <ModernFooter />
      </div>
    </ProtectedRoute>
  );
}