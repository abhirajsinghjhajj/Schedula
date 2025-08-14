"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { prescriptionsAPI, type Prescription } from "@/lib/api";
import { appointmentsAPI, type Appointment } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Plus, Search, Edit, Trash2, Calendar, User, Pill } from "lucide-react";

export default function PrescriptionsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingPrescription, setEditingPrescription] = useState<Prescription | null>(null);
  const [formData, setFormData] = useState({
    appointmentId: "",
    patientId: "",
    patientName: "",
    medicineName: "",
    dosage: "",
    duration: "",
    instructions: "",
    notes: "",
  });

  useEffect(() => {
    if (user?.id) {
      loadPrescriptions();
      loadAppointments();
    }
  }, [user]);

  const loadPrescriptions = async () => {
    try {
      const data = await prescriptionsAPI.getByDoctorId(user!.id);
      setPrescriptions(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load prescriptions",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadAppointments = async () => {
    try {
      const data = await appointmentsAPI.getByDoctorId(user!.id);
      setAppointments(data.filter(apt => apt.status === "completed"));
    } catch (error) {
      console.error("Failed to load appointments:", error);
    }
  };

  const handleCreatePrescription = async () => {
    try {
      const appointment = appointments.find(apt => apt.id === formData.appointmentId);
      if (!appointment) {
        toast({
          title: "Error",
          description: "Please select a valid appointment",
          variant: "destructive",
        });
        return;
      }

      const newPrescription = await prescriptionsAPI.create({
        appointmentId: formData.appointmentId,
        doctorId: user!.id,
        patientId: appointment.patientId,
        doctorName: user!.name,
        patientName: appointment.patientName,
        medicineName: formData.medicineName,
        dosage: formData.dosage,
        duration: formData.duration,
        instructions: formData.instructions,
        notes: formData.notes,
        prescribedDate: new Date().toISOString().split('T')[0],
        status: "active",
      });

      setPrescriptions([...prescriptions, newPrescription]);
      setIsCreateDialogOpen(false);
      resetForm();
      toast({
        title: "Success",
        description: "Prescription created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create prescription",
        variant: "destructive",
      });
    }
  };

  const handleEditPrescription = async () => {
    if (!editingPrescription) return;

    try {
      const updatedPrescription = await prescriptionsAPI.update(editingPrescription.id, {
        medicineName: formData.medicineName,
        dosage: formData.dosage,
        duration: formData.duration,
        instructions: formData.instructions,
        notes: formData.notes,
      });

      setPrescriptions(prescriptions.map(p => p.id === editingPrescription.id ? updatedPrescription : p));
      setIsEditDialogOpen(false);
      setEditingPrescription(null);
      resetForm();
      toast({
        title: "Success",
        description: "Prescription updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update prescription",
        variant: "destructive",
      });
    }
  };

  const handleDeletePrescription = async (prescriptionId: string) => {
    try {
      await prescriptionsAPI.delete(prescriptionId);
      setPrescriptions(prescriptions.filter(p => p.id !== prescriptionId));
      toast({
        title: "Success",
        description: "Prescription deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete prescription",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      appointmentId: "",
      patientId: "",
      patientName: "",
      medicineName: "",
      dosage: "",
      duration: "",
      instructions: "",
      notes: "",
    });
  };

  const openEditDialog = (prescription: Prescription) => {
    setEditingPrescription(prescription);
    setFormData({
      appointmentId: prescription.appointmentId,
      patientId: prescription.patientId,
      patientName: prescription.patientName,
      medicineName: prescription.medicineName,
      dosage: prescription.dosage,
      duration: prescription.duration,
      instructions: prescription.instructions,
      notes: prescription.notes,
    });
    setIsEditDialogOpen(true);
  };

  const filteredPrescriptions = prescriptions.filter(prescription =>
    prescription.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prescription.medicineName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadgeVariant = (status: Prescription["status"]) => {
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

  return (
    <ProtectedRoute allowedRoles={["doctor"]}>
      <div className="min-h-screen bg-background">
        <Navbar />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Prescription Management
            </h1>
            <p className="text-muted-foreground text-lg">
              Manage prescriptions for your patients
            </p>
          </div>

          {/* Search and Create */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search prescriptions by patient or medicine..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Prescription
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New Prescription</DialogTitle>
                  <DialogDescription>
                    Create a new prescription for a patient
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="appointment">Select Appointment</Label>
                    <Select
                      value={formData.appointmentId}
                      onValueChange={(value) => {
                        const appointment = appointments.find(apt => apt.id === value);
                        setFormData({
                          ...formData,
                          appointmentId: value,
                          patientId: appointment?.patientId || "",
                          patientName: appointment?.patientName || "",
                        });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select an appointment" />
                      </SelectTrigger>
                      <SelectContent>
                        {appointments.map((appointment) => (
                          <SelectItem key={appointment.id} value={appointment.id}>
                            {appointment.patientName} - {appointment.date} {appointment.time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="medicineName">Medicine Name</Label>
                    <Input
                      id="medicineName"
                      value={formData.medicineName}
                      onChange={(e) => setFormData({ ...formData, medicineName: e.target.value })}
                      placeholder="Enter medicine name"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="dosage">Dosage</Label>
                      <Input
                        id="dosage"
                        value={formData.dosage}
                        onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                        placeholder="e.g., 10mg"
                      />
                    </div>
                    <div>
                      <Label htmlFor="duration">Duration</Label>
                      <Input
                        id="duration"
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                        placeholder="e.g., 30 days"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="instructions">Instructions</Label>
                    <Textarea
                      id="instructions"
                      value={formData.instructions}
                      onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                      placeholder="Enter instructions for the patient"
                    />
                  </div>
                  <div>
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Additional notes (optional)"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreatePrescription}>
                    Create Prescription
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Prescriptions List */}
          <Card>
            <CardHeader>
              <CardTitle>All Prescriptions</CardTitle>
              <CardDescription>
                {filteredPrescriptions.length} prescription{filteredPrescriptions.length !== 1 ? 's' : ''} found
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8 text-muted-foreground">Loading prescriptions...</div>
              ) : filteredPrescriptions.length === 0 ? (
                <div className="text-center py-8">
                  <Pill className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No prescriptions found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredPrescriptions.map((prescription) => (
                    <div
                      key={prescription.id}
                      className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium text-foreground">{prescription.patientName}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Pill className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium text-foreground">{prescription.medicineName}</span>
                          </div>
                          <Badge variant={getStatusBadgeVariant(prescription.status)}>
                            {prescription.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p><strong>Dosage:</strong> {prescription.dosage} • <strong>Duration:</strong> {prescription.duration}</p>
                          <p><strong>Instructions:</strong> {prescription.instructions}</p>
                          {prescription.notes && <p><strong>Notes:</strong> {prescription.notes}</p>}
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3 w-3" />
                            <span>Prescribed: {prescription.prescribedDate}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openEditDialog(prescription)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle>Edit Prescription</DialogTitle>
                              <DialogDescription>
                                Update prescription details
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="edit-medicineName">Medicine Name</Label>
                                <Input
                                  id="edit-medicineName"
                                  value={formData.medicineName}
                                  onChange={(e) => setFormData({ ...formData, medicineName: e.target.value })}
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor="edit-dosage">Dosage</Label>
                                  <Input
                                    id="edit-dosage"
                                    value={formData.dosage}
                                    onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="edit-duration">Duration</Label>
                                  <Input
                                    id="edit-duration"
                                    value={formData.duration}
                                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                  />
                                </div>
                              </div>
                              <div>
                                <Label htmlFor="edit-instructions">Instructions</Label>
                                <Textarea
                                  id="edit-instructions"
                                  value={formData.instructions}
                                  onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                                />
                              </div>
                              <div>
                                <Label htmlFor="edit-notes">Notes</Label>
                                <Textarea
                                  id="edit-notes"
                                  value={formData.notes}
                                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                                Cancel
                              </Button>
                              <Button onClick={handleEditPrescription}>
                                Update Prescription
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Prescription</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this prescription? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeletePrescription(prescription.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
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
