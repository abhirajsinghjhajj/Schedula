"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { medicalHistoryAPI, type MedicalHistory } from "@/lib/api";
import { prescriptionsAPI, type Prescription } from "@/lib/api";
import { appointmentsAPI, type Appointment } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Calendar, User, Pill, Stethoscope, FileText, Download } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function PatientMedicalHistoryPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const params = useParams();
  const patientId = params.patientId as string;
  
  const [medicalHistory, setMedicalHistory] = useState<MedicalHistory[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patientName, setPatientName] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.id && patientId) {
      loadPatientData();
    }
  }, [user, patientId]);

  const loadPatientData = async () => {
    try {
      const [historyData, prescriptionsData, appointmentsData] = await Promise.all([
        medicalHistoryAPI.getByPatientId(patientId),
        prescriptionsAPI.getByPatientId(patientId),
        appointmentsAPI.getByPatientId(patientId)
      ]);

      setMedicalHistory(historyData);
      setPrescriptions(prescriptionsData);
      setAppointments(appointmentsData);

      // Get patient name from first appointment or prescription
      const firstAppointment = appointmentsData[0];
      const firstPrescription = prescriptionsData[0];
      setPatientName(firstAppointment?.patientName || firstPrescription?.patientName || "Unknown Patient");

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load patient data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadgeVariant = (status: Appointment["status"]) => {
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

  const getPrescriptionStatusBadgeVariant = (status: Prescription["status"]) => {
    switch (status) {
      case "active":
        return "default";
      case "completed":
        return "outline";
      case "cancelled":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const downloadMedicalHistory = () => {
    const data = {
      patientName,
      patientId,
      appointments: appointments,
      prescriptions: prescriptions,
      medicalHistory: medicalHistory,
      generatedOn: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${patientName.replace(/\s+/g, '_')}_medical_history.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Success",
      description: "Medical history downloaded successfully",
    });
  };

  if (isLoading) {
    return (
      <ProtectedRoute allowedRoles={["doctor"]}>
        <div className="min-h-screen bg-background">
          <Navbar />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center py-8 text-muted-foreground">Loading patient data...</div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={["doctor"]}>
      <div className="min-h-screen bg-background">
        <Navbar />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Link href="/doctor/appointments">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Appointments
                </Button>
              </Link>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-2">
                  Medical History
                </h1>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span className="text-lg">{patientName}</span>
                  <span>•</span>
                  <span>Patient ID: {patientId}</span>
                </div>
              </div>
              <Button onClick={downloadMedicalHistory}>
                <Download className="h-4 w-4 mr-2" />
                Download History
              </Button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
                <Calendar className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{appointments.length}</div>
                <p className="text-xs text-muted-foreground">All time</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Prescriptions</CardTitle>
                <Pill className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {prescriptions.filter(p => p.status === "active").length}
                </div>
                <p className="text-xs text-muted-foreground">Currently active</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Medical Records</CardTitle>
                <FileText className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{medicalHistory.length}</div>
                <p className="text-xs text-muted-foreground">Diagnoses & treatments</p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="appointments" className="space-y-6">
            <TabsList>
              <TabsTrigger value="appointments">Appointments</TabsTrigger>
              <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
              <TabsTrigger value="medical-records">Medical Records</TabsTrigger>
            </TabsList>

            {/* Appointments Tab */}
            <TabsContent value="appointments" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Appointment History</CardTitle>
                  <CardDescription>
                    Chronological list of all appointments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {appointments.length === 0 ? (
                    <div className="text-center py-8">
                      <Calendar className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No appointments found</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {appointments
                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                        .map((appointment) => (
                          <div
                            key={appointment.id}
                            className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-4 mb-2">
                                <div className="flex items-center gap-2">
                                  <Stethoscope className="h-4 w-4 text-muted-foreground" />
                                  <span className="font-medium text-foreground">{appointment.doctorName}</span>
                                </div>
                                <Badge variant={getStatusBadgeVariant(appointment.status)}>
                                  {appointment.status}
                                </Badge>
                              </div>
                              <div className="text-sm text-muted-foreground space-y-1">
                                <p><strong>Specialty:</strong> {appointment.specialty}</p>
                                <p><strong>Type:</strong> {appointment.consultationType}</p>
                                {appointment.symptoms && <p><strong>Symptoms:</strong> {appointment.symptoms}</p>}
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-3 w-3" />
                                  <span>{formatDate(appointment.date)} at {appointment.time}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Prescriptions Tab */}
            <TabsContent value="prescriptions" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Prescription History</CardTitle>
                  <CardDescription>
                    All prescriptions prescribed to this patient
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {prescriptions.length === 0 ? (
                    <div className="text-center py-8">
                      <Pill className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No prescriptions found</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {prescriptions
                        .sort((a, b) => new Date(b.prescribedDate).getTime() - new Date(a.prescribedDate).getTime())
                        .map((prescription) => (
                          <div
                            key={prescription.id}
                            className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-4 mb-2">
                                <div className="flex items-center gap-2">
                                  <Pill className="h-4 w-4 text-muted-foreground" />
                                  <span className="font-medium text-foreground">{prescription.medicineName}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <User className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm">{prescription.doctorName}</span>
                                </div>
                                <Badge variant={getPrescriptionStatusBadgeVariant(prescription.status)}>
                                  {prescription.status}
                                </Badge>
                              </div>
                              <div className="text-sm text-muted-foreground space-y-1">
                                <p><strong>Dosage:</strong> {prescription.dosage} • <strong>Duration:</strong> {prescription.duration}</p>
                                <p><strong>Instructions:</strong> {prescription.instructions}</p>
                                {prescription.notes && <p><strong>Notes:</strong> {prescription.notes}</p>}
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-3 w-3" />
                                  <span>Prescribed: {formatDate(prescription.prescribedDate)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Medical Records Tab */}
            <TabsContent value="medical-records" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Medical Records</CardTitle>
                  <CardDescription>
                    Diagnoses, symptoms, and treatment history
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {medicalHistory.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No medical records found</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {medicalHistory
                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                        .map((record) => (
                          <div
                            key={record.id}
                            className="p-4 bg-muted/50 rounded-lg"
                          >
                            <div className="flex items-center gap-4 mb-3">
                              <div className="flex items-center gap-2">
                                <Stethoscope className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium text-foreground">{record.doctorName}</span>
                              </div>
                              <Badge variant="outline">{record.specialty}</Badge>
                            </div>
                            <div className="space-y-2">
                              <div>
                                <strong className="text-foreground">Diagnosis:</strong>
                                <p className="text-sm text-muted-foreground ml-2">{record.diagnosis}</p>
                              </div>
                              <div>
                                <strong className="text-foreground">Symptoms:</strong>
                                <p className="text-sm text-muted-foreground ml-2">{record.symptoms}</p>
                              </div>
                              <div>
                                <strong className="text-foreground">Treatment:</strong>
                                <p className="text-sm text-muted-foreground ml-2">{record.treatment}</p>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                <span>{formatDate(record.date)}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  );
}
