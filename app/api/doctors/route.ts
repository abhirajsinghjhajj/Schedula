import { NextResponse } from 'next/server';
import db from '@/db.json'; // Adjust the path if your db.json is elsewhere

export async function GET() {
  try {
    const doctors = db.doctors;
    return NextResponse.json(doctors);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching doctors' }, { status: 500 });
  }
}