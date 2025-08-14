"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useSearchParams } from "next/navigation";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ModernNavbar } from "@/components/ModernNavbar";
import { ModernFooter } from "@/components/ModernFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { doctorsAPI, type Doctor } from "@/lib/api";
import { Phone, Star, Calendar, DollarSign, Clock, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

export default function CallConsultationPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState(searchParams.get("specialty") || "all");
  const [sortBy, setSortBy] = useState("rating");
  const [isLoading, setIsLoading] = useState(true);

  const loadDoctors = async () => {
    setIsLoading(true);
    try {
      const allDoctors = await doctorsAPI.getAll();
      setDoctors(allDoctors);
    } catch (error) {
      console.error("Failed to load doctors:", error);
      toast({
        title: "Error",
        description: "Failed to load doctors. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    let tempDoctors = [...doctors];

    // Filter by search term
    if (searchTerm) {
      tempDoctors = tempDoctors.filter(
        (doctor) =>
          doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doctor.about.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by specialty
    if (selectedSpecialty !== "all") {
      tempDoctors = tempDoctors.filter(
        (doctor) => doctor.specialty.toLowerCase() === selectedSpecialty
      );
    }

    // Sort the results
    switch (sortBy) {
      case "rating":
        tempDoctors.sort((a, b) => b.rating - a.rating);
        break;
      case "experience":
        tempDoctors.sort(
          (a, b) =>
            parseInt(b.experience.split(" ")[0]) -
            parseInt(a.experience.split(" ")[0])
        );
        break;
      case "fee":
        tempDoctors.sort((a, b) => a.callConsultationFee - b.callConsultationFee);
        break;
      case "name":
        tempDoctors.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    setFilteredDoctors(tempDoctors);
  };

  useEffect(() => {
    loadDoctors();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [searchTerm, selectedSpecialty, sortBy, doctors]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <ModernNavbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            <Skeleton className="h-12 w-96 mx-auto" />
            <Skeleton className="h-6 w-64 mx-auto" />
            <Skeleton className="h-20 w-full" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-48 w-full" />
              ))}
            </div>
          </div>
        </div>
        <ModernFooter />
      </div>
    );
  }

  return (
    <ProtectedRoute allowedRoles={["patient"]}>
      {/* CHANGED: Replaced hardcoded background with theme's 'background' color */}
      <div className="min-h-screen bg-background">
        <ModernNavbar />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              {/* CHANGED: Icon uses theme's 'primary' color */}
              <Phone className="w-12 h-12 text-primary mr-4" />
              {/* CHANGED: Text uses theme-aware colors */}
              <h1 className="text-4xl font-bold text-foreground">Call Consultation</h1>
            </div>
            <p className="text-muted-foreground text-lg">Get medical advice through secure phone consultations</p>
          </div>

          {/* Search and Filters */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="lg:col-span-2">
                  <Input
                    placeholder="Search by doctor name, specialty, or condition..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div>
                  <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                    <SelectTrigger><SelectValue placeholder="All Specialties" /></SelectTrigger>
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
                <div>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger><SelectValue placeholder="Sort By" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                      <SelectItem value="experience">Most Experienced</SelectItem>
                      <SelectItem value="fee">Lowest Fee</SelectItem>
                      <SelectItem value="name">Name A-Z</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          {filteredDoctors.length === 0 ? (
            <Card className="text-center py-12 bg-card">
              <CardContent>
                <Search className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No doctors found</h3>
                <p className="text-muted-foreground">Try adjusting your search criteria</p>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="mb-6">
                <p className="text-muted-foreground">
                  Found {filteredDoctors.length} doctor{filteredDoctors.length !== 1 ? "s" : ""} available for phone consultation
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredDoctors.map((doctor) => (
                  <Card key={doctor.id} className="hover:shadow-lg transition-shadow bg-card">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <img
                          src={doctor.image || "/placeholder.svg"}
                          alt={doctor.name}
                          className="w-20 h-20 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-xl font-semibold text-foreground">{doctor.name}</h3>
                              {/* CHANGED: Specialty text uses theme's 'primary' color */}
                              <p className="text-primary font-medium">{doctor.specialty}</p>
                              <p className="text-sm text-muted-foreground">{doctor.qualifications}</p>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center">
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                <span className="ml-1 text-sm font-medium text-foreground">{doctor.rating}</span>
                                <span className="ml-1 text-sm text-muted-foreground">({doctor.reviewCount})</span>
                              </div>
                            </div>
                          </div>

                          <div className="mt-3 space-y-2 text-muted-foreground">
                            <div className="flex items-center text-sm">
                              <Calendar className="w-4 h-4 mr-2" />
                              {doctor.experience} years experience
                            </div>
                            <div className="flex items-center text-sm">
                              <DollarSign className="w-4 h-4 mr-2" />
                              Phone consultation: ${doctor.callConsultationFee}
                            </div>
                            <div className="flex items-center text-sm">
                              <Clock className="w-4 h-4 mr-2" />
                              Available today
                            </div>
                          </div>

                          <div className="mt-4">
                            <p className="text-sm text-muted-foreground line-clamp-2">{doctor.about}</p>
                          </div>

                          <div className="mt-4 flex items-center justify-between">
                            <Badge variant="secondary" className="text-xs">
                              <Phone className="w-3 h-3 mr-1" />
                              Call Available
                            </Badge>
                            <div className="space-x-2">
                              <Link href={`/doctor/${doctor.id}`}>
                                <Button variant="outline" size="sm">View Profile</Button>
                              </Link>
                              <Link href={`/booking/${doctor.id}?type=call`}>
                                <Button size="sm">Book Phone Call</Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>

        <ModernFooter />
      </div>
    </ProtectedRoute>
  );
}