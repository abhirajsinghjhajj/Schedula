import { NextResponse } from 'next/server';
import db from '../../../db.json';

export async function GET() {
  try {
    const patients = db.patients;
    return NextResponse.json(patients);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching patients' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const patientData = await request.json();
    
    if (!patientData.name || !patientData.email || !patientData.password) {
      return NextResponse.json({ message: 'Missing required patient information' }, { status: 400 });
    }

    const newPatient = {
      ...patientData,
      id: Date.now().toString(),
      role: 'patient'
    };

    // In a real app, you would save this to the database
    console.log('New Patient Created:', newPatient);
    
    return NextResponse.json({ message: 'Patient created successfully!', patient: newPatient });
  } catch (error) {
    return NextResponse.json({ message: 'Error creating patient' }, { status: 500 });
  }
}
