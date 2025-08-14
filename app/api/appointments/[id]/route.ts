import { NextResponse } from 'next/server';
import db from '../../../../db.json';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const updates = await request.json();
    const appointment = db.appointments.find(apt => apt.id === params.id);
    
    if (!appointment) {
      return NextResponse.json({ message: 'Appointment not found' }, { status: 404 });
    }

    const updatedAppointment = { ...appointment, ...updates };
    
    // In a real app, you would update this in the database
    console.log('Appointment Updated:', updatedAppointment);
    
    return NextResponse.json({ message: 'Appointment updated successfully!', appointment: updatedAppointment });
  } catch (error) {
    return NextResponse.json({ message: 'Error updating appointment' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const appointment = db.appointments.find(apt => apt.id === params.id);
    
    if (!appointment) {
      return NextResponse.json({ message: 'Appointment not found' }, { status: 404 });
    }

    // In a real app, you would delete this from the database
    console.log('Appointment Deleted:', appointment);
    
    return NextResponse.json({ message: 'Appointment deleted successfully!' });
  } catch (error) {
    return NextResponse.json({ message: 'Error deleting appointment' }, { status: 500 });
  }
}
