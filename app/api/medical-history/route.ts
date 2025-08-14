import { NextResponse } from 'next/server';
import db from '@/db.json';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get('patientId');

    let medicalHistory = db.medicalHistory;

    if (patientId) {
      medicalHistory = medicalHistory.filter(m => m.patientId === patientId);
    }

    return NextResponse.json(medicalHistory);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching medical history' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const medicalRecord = await request.json();
    
    if (!medicalRecord.patientId || !medicalRecord.diagnosis || !medicalRecord.treatment) {
      return NextResponse.json({ message: 'Missing required medical record information' }, { status: 400 });
    }

    const newMedicalRecord = {
      ...medicalRecord,
      id: Date.now().toString(),
      date: medicalRecord.date || new Date().toISOString().split('T')[0]
    };

    // In a real app, you would save this to the database
    console.log('New Medical Record Created:', newMedicalRecord);
    
    return NextResponse.json({ message: 'Medical record created successfully!', medicalRecord: newMedicalRecord });
  } catch (error) {
    return NextResponse.json({ message: 'Error creating medical record' }, { status: 500 });
  }
}
