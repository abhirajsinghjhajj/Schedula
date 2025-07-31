🩺 Schedula - Doctor Appointment Booking App
Welcome to Schedula, a modern, full-stack web application designed to streamline the process of booking doctor appointments. This platform features a robust, role-based system for both patients and doctors, ensuring a seamless healthcare experience.

✨ Features
👤 For Patients
Advanced Search: Effortlessly find doctors and filter them by specialty.

Seamless Booking: Book appointments in just a few clicks.

Appointment History: View and manage your past and upcoming appointments.

Profile Management: Easily update and manage your personal information.

👨‍⚕️ For Doctors
Insightful Dashboard: Get a complete overview of appointment statistics.

Professional Profile: Manage your public-facing professional details.

Appointment Management: View your schedule and manage patient appointments.

Status Control: Quickly confirm or cancel appointments.

🛠️ Tech Stack
Framework: Next.js 14 (App Router) with TypeScript

Styling: Tailwind CSS for a utility-first approach

UI Components: Built with the excellent shadcn/ui

State Management: React Context API for clean global state

Mock Backend: json-server for rapid prototyping

Authentication: Secure role-based authentication using localStorage for session management

🚀 Getting Started
Follow these steps to get the application running locally on your machine.

Prerequisites
Node.js (version 18 or higher)

npm or another package manager like yarn or pnpm

Installation & Setup
Clone the Repository

Bash

git clone https://github.com/your-username/schedula.git
cd schedula
Install Dependencies

Bash

npm install
Run the Mock Backend (in a dedicated terminal)
This command starts the JSON server, which acts as our database.

Bash

npm run json-server
You should see output confirming the server is running on http://localhost:3001.

Run the Frontend Application (in a second terminal)

Bash

npm run dev
Launch the App
Open your browser and navigate to http://localhost:3000.

🔑 Default Login Credentials
Use the following accounts to test the application.

Doctor Account
Email: sarah.johnson@email.com

Password: doctor123

Patient Account
Email: john@example.com

Password: patient123

📁 Project Structure
.
├── app/              # Next.js App Router directory
│   ├── (auth)/       # Authentication pages
│   ├── (doctor)/     # Doctor-specific routes and dashboards
│   └── (patient)/    # Patient-specific routes
├── components/       # Reusable React components
│   └── ui/           # Core UI elements from shadcn/ui
├── contexts/         # Global React contexts (e.g., AuthContext)
├── lib/              # Utility functions and API logic
└── db.json           # Mock database file for json-server
🌐 API Endpoints
The mock API runs on http://localhost:3001 and provides the following endpoints:

GET /doctors - Fetches all doctor profiles.

GET /patients - Fetches all patient profiles.

GET /appointments - Fetches all appointments.

POST /doctors - Creates a new doctor account.

POST /patients - Creates a new patient account.

POST /appointments - Books a new appointment.

PATCH /appointments/:id - Updates the status of an existing appointment.

✅ Core Features Implemented
[x] Role-based authentication (Doctor/Patient)

[x] Responsive design with a beautiful dark theme

[x] Advanced doctor search and filtering system

[x] End-to-end appointment booking and management

[x] Comprehensive profile management for both roles

[x] Insightful dashboard with key statistics

[x] Dynamic appointment status management

[x] Robust form validation

[x] User-friendly toast notifications for feedback

☁️ Deployment
To create a production build of the application:

Build the Project

Bash

npm run build
Start the Production Server

Bash

npm run start
Note: For the mock API, you will need to deploy json-server separately or replace it with a production-ready backend service.

🤝 Contributing
Contributions are welcome! Please follow these steps:

Fork the repository.

Create a new branch (git checkout -b feature/your-feature-name).

Make your changes and commit them (git commit -m 'Add some feature').

Push to the branch (git push origin feature/your-feature-name).

Open a Pull Request.
