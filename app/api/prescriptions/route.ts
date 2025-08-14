import { NextResponse } from 'next/server';
import db from '../../../db.json';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const doctorId = searchParams.get('doctorId');
    const patientId = searchParams.get('patientId');

    let prescriptions = db.prescriptions;

    if (doctorId) {
      prescriptions = prescriptions.filter(p => p.doctorId === doctorId);
    }

    if (patientId) {
      prescriptions = prescriptions.filter(p => p.patientId === patientId);
    }

    return NextResponse.json(prescriptions);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching prescriptions' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const prescription = await request.json();
    
    if (!prescription.appointmentId || !prescription.doctorId || !prescription.patientId || !prescription.medicineName) {
      return NextResponse.json({ message: 'Missing required prescription information' }, { status: 400 });
    }

    const newPrescription = {
      ...prescription,
      id: Date.now().toString(),
      prescribedDate: prescription.prescribedDate || new Date().toISOString().split('T')[0],
      status: prescription.status || 'active'
    };

    // In a real app, you would save this to the database
    console.log('New Prescription Created:', newPrescription);
    
    return NextResponse.json({ message: 'Prescription created successfully!', prescription: newPrescription });
  } catch (error) {
    return NextResponse.json({ message: 'Error creating prescription' }, { status: 500 });
  }
}
