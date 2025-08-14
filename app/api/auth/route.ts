import { NextResponse } from 'next/server';
import db from '@/db.json'; // Adjust the path

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    const user = db.users.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      // In a real app, you'd return a JWT token. Here, we'll return user data.
      const { password, ...userWithoutPassword } = user;
      return NextResponse.json(userWithoutPassword);
    } else {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ message: 'An error occurred' }, { status: 500 });
  }
}