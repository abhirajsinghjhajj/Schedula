import { NextResponse } from 'next/server';
import db from '../../../../db.json';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const doctor = db.doctors.find(d => d.id === params.id);
    
    if (!doctor) {
      return NextResponse.json({ message: 'Doctor not found' }, { status: 404 });
    }

    return NextResponse.json(doctor);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching doctor' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const updates = await request.json();
    const doctor = db.doctors.find(d => d.id === params.id);
    
    if (!doctor) {
      return NextResponse.json({ message: 'Doctor not found' }, { status: 404 });
    }

    const updatedDoctor = { ...doctor, ...updates };
    
    // In a real app, you would update this in the database
    console.log('Doctor Updated:', updatedDoctor);
    
    return NextResponse.json({ message: 'Doctor updated successfully!', doctor: updatedDoctor });
  } catch (error) {
    return NextResponse.json({ message: 'Error updating doctor' }, { status: 500 });
  }
}
