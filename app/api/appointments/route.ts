import { NextResponse } from 'next/server';
import db from '../../../db.json';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const doctorId = searchParams.get('doctorId');
    const patientId = searchParams.get('patientId');

    let appointments = db.appointments;

    if (doctorId) {
      appointments = appointments.filter(apt => apt.doctorId === doctorId);
    }

    if (patientId) {
      appointments = appointments.filter(apt => apt.patientId === patientId);
    }

    return NextResponse.json(appointments);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching appointments' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { doctorId, userId, date, time } = await request.json();

    if (!doctorId || !userId || !date || !time) {
      return NextResponse.json({ message: 'Missing booking information' }, { status: 400 });
    }
    
    // In a real app, you would save this to the database.
    // For this mock, we'll just log it and return success.
    console.log('New Appointment Booked:', { doctorId, userId, date, time });

    const newAppointment = { id: `appt_${Date.now()}`, doctorId, userId, date, time, status: 'confirmed' };
    // You could push this to the db.appointments array if you wanted state
    
    return NextResponse.json({ message: 'Appointment booked successfully!', appointment: newAppointment });

  } catch (error) {
    return NextResponse.json({ message: 'An error occurred' }, { status: 500 });
  }
}