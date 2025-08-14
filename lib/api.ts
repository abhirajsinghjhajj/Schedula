const API_BASE = typeof window !== 'undefined' 
  ? `${window.location.origin}/api`
  : '/api';

// CORRECTED: Complete and accurate type definitions for your entire application.
export interface Doctor {
  id: string;
  name: string;
  email: string;
  password?: string;
  phone: string;
  specialty: string;
  qualifications: string;
  experience: string;
  clinicAddress: string;
  rating: number;
  reviewCount: number;
  consultationFee: number;
  videoConsultationFee: number;
  callConsultationFee?: number;
  availability: {
    clinic: string[];
    online: string[];
  };
  timeSlots: string[];
  image: string;
  about: string;
  consultationType: string[];
}

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  password?: string;
  role?: 'patient';
}

export interface Appointment {
  id: string;
  doctorId: string;
  patientId: string;
  doctorName: string;
  patientName: string;
  specialty: string;
  date: string;
  time: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  consultationType: string;
  symptoms?: string;
  fee: number;
}

export interface Prescription {
  id: string;
  appointmentId: string;
  doctorId: string;
  patientId: string;
  doctorName: string;
  patientName: string;
  medicineName: string;
  dosage: string;
  duration: string;
  instructions: string;
  notes: string;
  prescribedDate: string;
  status: "active" | "completed" | "cancelled";
}

export interface MedicalHistory {
  id: string;
  patientId: string;
  appointmentId: string;
  diagnosis: string;
  symptoms: string;
  treatment: string;
  date: string;
  doctorName: string;
  specialty: string;
}


// Auth API
export const authAPI = {
  async login(email: string, password: string, role: "doctor" | "patient") {
    try {
      const endpoint = role === "doctor" ? "doctors" : "patients";
      const response = await fetch(`${API_BASE}/${endpoint}`);

      if (!response.ok) {
        throw new Error("Server not responding. Please try again later.");
      }

      const users = await response.json();
      const user = users.find((u: any) => u.email === email && u.password === password);

      if (!user) {
        throw new Error("Invalid email or password");
      }

      return { ...user, role };
    } catch (error) {
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error("Cannot connect to server. Please check your internet connection.");
      }
      throw error;
    }
  },

  async signup(userData: any, role: "doctor" | "patient") {
    try {
      const endpoint = role === "doctor" ? "doctors" : "patients";
      const response = await fetch(`${API_BASE}/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...userData, id: Date.now().toString() }),
      });

      if (!response.ok) {
        throw new Error("Server not responding. Please try again later.");
      }

      const user = await response.json();
      return { ...user, role };
    } catch (error) {
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error("Cannot connect to server. Please check your internet connection.");
      }
      throw error;
    }
  },
};

// Doctors API
export const doctorsAPI = {
  async getAll(): Promise<Doctor[]> {
    try {
      const response = await fetch(`${API_BASE}/doctors`);
      if (!response.ok) {
        throw new Error("Failed to fetch doctors");
      }
      return response.json();
    } catch (error) {
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error("Cannot connect to server. Please check your internet connection.");
      }
      throw error;
    }
  },

  async getById(id: string): Promise<Doctor> {
    try {
      const response = await fetch(`${API_BASE}/doctors/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch doctor");
      }
      return response.json();
    } catch (error) {
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error("Cannot connect to server. Please check your internet connection.");
      }
      throw error;
    }
  },

  async update(id: string, data: Partial<Doctor>): Promise<Doctor> {
    try {
      const response = await fetch(`${API_BASE}/doctors/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Failed to update doctor");
      }
      return response.json();
    } catch (error) {
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error("Cannot connect to server. Please check your internet connection.");
      }
      throw error;
    }
  },
};

// Appointments API
export const appointmentsAPI = {
  async create(appointment: Omit<Appointment, "id">): Promise<Appointment> {
    try {
      const response = await fetch(`${API_BASE}/appointments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...appointment, id: Date.now().toString() }),
      });
      if (!response.ok) {
        throw new Error("Failed to create appointment");
      }
      return response.json();
    } catch (error) {
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error("Cannot connect to server. Please check your internet connection.");
      }
      throw error;
    }
  },

  async getByDoctorId(doctorId: string): Promise<Appointment[]> {
    try {
      const response = await fetch(`${API_BASE}/appointments?doctorId=${doctorId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch appointments");
      }
      return response.json();
    } catch (error) {
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error("Cannot connect to server. Please check your internet connection.");
      }
      throw error;
    }
  },

  async getByPatientId(patientId: string): Promise<Appointment[]> {
    try {
      const response = await fetch(`${API_BASE}/appointments?patientId=${patientId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch appointments");
      }
      return response.json();
    } catch (error) {
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error("Cannot connect to server. Please check your internet connection.");
      }
      throw error;
    }
  },

  async updateStatus(id: string, status: Appointment["status"]): Promise<Appointment> {
    try {
      const response = await fetch(`${API_BASE}/appointments/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) {
        throw new Error("Failed to update appointment");
      }
      return response.json();
    } catch (error) {
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error("Cannot connect to server. Please check your internet connection.");
      }
      throw error;
    }
  },
  
  cancelAppointment: async (appointmentId: string): Promise<void> => {
    const response = await fetch(`${API_BASE}/appointments/${appointmentId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete the appointment.');
    }
  },
};

// Prescriptions API
export const prescriptionsAPI = {
  async create(prescription: Omit<Prescription, "id">): Promise<Prescription> {
    try {
      const response = await fetch(`${API_BASE}/prescriptions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...prescription, id: Date.now().toString() }),
      });
      if (!response.ok) {
        throw new Error("Failed to create prescription");
      }
      return response.json();
    } catch (error) {
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error("Cannot connect to server. Please check your internet connection.");
      }
      throw error;
    }
  },

  async getByDoctorId(doctorId: string): Promise<Prescription[]> {
    try {
      const response = await fetch(`${API_BASE}/prescriptions?doctorId=${doctorId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch prescriptions");
      }
      return response.json();
    } catch (error) {
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error("Cannot connect to server. Please check your internet connection.");
      }
      throw error;
    }
  },

  async getByPatientId(patientId: string): Promise<Prescription[]> {
    try {
      const response = await fetch(`${API_BASE}/prescriptions?patientId=${patientId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch prescriptions");
      }
      return response.json();
    } catch (error) {
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error("Cannot connect to server. Please check your internet connection.");
      }
      throw error;
    }
  },

  async update(id: string, data: Partial<Prescription>): Promise<Prescription> {
    try {
      const response = await fetch(`${API_BASE}/prescriptions/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Failed to update prescription");
      }
      return response.json();
    } catch (error) {
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error("Cannot connect to server. Please check your internet connection.");
      }
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE}/prescriptions/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete prescription");
      }
    } catch (error) {
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error("Cannot connect to server. Please check your internet connection.");
      }
      throw error;
    }
  },
};

// Medical History API
export const medicalHistoryAPI = {
  async getByPatientId(patientId: string): Promise<MedicalHistory[]> {
    try {
      const response = await fetch(`${API_BASE}/medical-history?patientId=${patientId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch medical history");
      }
      return response.json();
    } catch (error) {
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error("Cannot connect to server. Please check your internet connection.");
      }
      throw error;
    }
  },

  async create(medicalRecord: Omit<MedicalHistory, "id">): Promise<MedicalHistory> {
    try {
      const response = await fetch(`${API_BASE}/medical-history`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...medicalRecord, id: Date.now().toString() }),
      });
      if (!response.ok) {
        throw new Error("Failed to create medical record");
      }
      return response.json();
    } catch (error) {
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error("Cannot connect to server. Please check your internet connection.");
      }
      throw error;
    }
  },
};
