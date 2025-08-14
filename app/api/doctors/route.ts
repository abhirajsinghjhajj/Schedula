import { NextResponse } from 'next/server';
import db from '../../../db.json';

export async function GET() {
  try {
    const doctors = db.doctors;
    return NextResponse.json(doctors);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching doctors' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const doctorData = await request.json();
    
    if (!doctorData.name || !doctorData.email || !doctorData.password) {
      return NextResponse.json({ message: 'Missing required doctor information' }, { status: 400 });
    }

    const newDoctor = {
      ...doctorData,
      id: Date.now().toString(),
    };

    // In a real app, you would save this to the database
    console.log('New Doctor Created:', newDoctor);
    
    return NextResponse.json({ message: 'Doctor created successfully!', doctor: newDoctor });
  } catch (error) {
    return NextResponse.json({ message: 'Error creating doctor' }, { status: 500 });
  }
}