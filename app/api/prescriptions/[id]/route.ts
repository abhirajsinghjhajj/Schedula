import { NextResponse } from 'next/server';
import db from '../../../../db.json';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const prescription = db.prescriptions.find(p => p.id === params.id);
    
    if (!prescription) {
      return NextResponse.json({ message: 'Prescription not found' }, { status: 404 });
    }

    return NextResponse.json(prescription);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching prescription' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const updates = await request.json();
    const prescription = db.prescriptions.find(p => p.id === params.id);
    
    if (!prescription) {
      return NextResponse.json({ message: 'Prescription not found' }, { status: 404 });
    }

    const updatedPrescription = { ...prescription, ...updates };
    
    // In a real app, you would update this in the database
    console.log('Prescription Updated:', updatedPrescription);
    
    return NextResponse.json({ message: 'Prescription updated successfully!', prescription: updatedPrescription });
  } catch (error) {
    return NextResponse.json({ message: 'Error updating prescription' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const prescription = db.prescriptions.find(p => p.id === params.id);
    
    if (!prescription) {
      return NextResponse.json({ message: 'Prescription not found' }, { status: 404 });
    }

    // In a real app, you would delete this from the database
    console.log('Prescription Deleted:', prescription);
    
    return NextResponse.json({ message: 'Prescription deleted successfully!' });
  } catch (error) {
    return NextResponse.json({ message: 'Error deleting prescription' }, { status: 500 });
  }
}
