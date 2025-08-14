
# Schedula – Modern Doctor Appointment Platform

Schedula is a modern, full‑stack doctor appointment platform built with Next.js 14. Patients can discover doctors and book appointments (clinic, video, or phone), while doctors manage schedules, prescriptions, and patient histories. The app ships with a mock API layer via Next.js API routes backed by a local JSON dataset, so it runs instantly without external services.

## ✨ Features

### 👤 For Patients
- **Advanced Search**: Effortlessly find doctors and filter them by specialty.
- **Seamless Booking**: Book appointments in just a few clicks.
- **Appointment History**: View and manage your past and upcoming appointments.
- **Profile Management**: Easily update and manage your personal information.

### 👨‍⚕️ For Doctors
- Real‑time dashboard with appointment statistics (pending, confirmed, completed)
- Manage professional profile and availability
- View and manage patient appointments (confirm/cancel/complete)
- **Prescription Management**: Create, edit, delete prescriptions after visits
- **Patient Medical History**: Full, chronological record (appointments, diagnoses, prescriptions)
- Optional: export/download history

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS (Dark theme enabled by default)
- **UI Components**: shadcn/ui
- **State Management**: React Context API
- **Mock Backend**: JSON Server
- **Authentication**: Role-based with localStorage

## 🚀 Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Open the app**: Go to http://localhost:3000 (Dark theme is default)

## Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Default Login Credentials

### Doctor Account
- Email: sarah.johnson@email.com
- Password: doctor123

### Patient Account  
- Email: john@example.com
- Password: patient123

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── appointments/  # Appointment endpoints
│   │   ├── prescriptions/ # Prescription endpoints
│   │   └── medical-history/ # Medical history endpoints
│   ├── auth/              # Authentication pages
│   ├── doctor/            # Doctor-specific pages
│   │   ├── dashboard/     # Doctor dashboard
│   │   ├── appointments/  # Appointment management
│   │   ├── prescriptions/ # Prescription management
│   │   └── medical-history/ # Patient medical history
│   ├── profile/           # Patient profile
│   └── appointments/      # Patient appointments
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui components
│   ├── Navbar.tsx        # Navigation component
│   └── ProtectedRoute.tsx # Route protection
├── contexts/             # React contexts
│   └── AuthContext.tsx   # Authentication context
├── lib/                  # Utility functions
│   └── api.ts           # API functions
└── db.json              # Mock database
```

## API Endpoints (Mock)

The API runs on `http://localhost:3000/api` with the following endpoints:

### Appointments
- `GET /appointments` - Get all appointments
- `POST /appointments` - Book appointment
- `PATCH /appointments/:id` - Update appointment status

### Prescriptions
- `GET /prescriptions` - Get all prescriptions (with optional filters)
- `POST /prescriptions` - Create prescription
- `GET /prescriptions/:id` - Get specific prescription
- `PATCH /prescriptions/:id` - Update prescription
- `DELETE /prescriptions/:id` - Delete prescription

### Medical History
  
### Doctors & Patients
- `GET /doctors` – List doctors
- `GET /doctors/:id` – Get doctor by ID
- `GET /patients` – List patients
- `GET /medical-history` - Get medical history (with optional filters)
- `POST /medical-history` - Create medical record

## New Features Implemented

✅ **Prescription Management System**
- Create prescriptions for patients after appointments
- Edit and delete existing prescriptions
- Search and filter prescriptions
- Track prescription status (active, completed, cancelled)

✅ **Patient Medical History**
- Comprehensive view of patient medical records
- Chronological display of appointments, prescriptions, and diagnoses
- Download medical history as JSON file
- Tabbed interface for easy navigation

✅ **Enhanced Doctor Dashboard**
- Real‑time updates when appointments are confirmed/cancelled/completed
- Quick access to appointments and prescriptions

## Features Previously Implemented

✅ Role-based authentication (Doctor/Patient)  
✅ Responsive design with dark theme (default)  
✅ Doctor search and filtering  
✅ Appointment booking system  
✅ Profile management  
✅ Dashboard with statistics  
✅ Appointment status management  
✅ Form validation  
✅ Toast notifications  

## Deployment

To deploy this application:

1. Build the project:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
