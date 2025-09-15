import { NextResponse } from 'next/server';

export async function GET() {
  // If the middleware has passed, it means the token is valid
  return NextResponse.json({ message: 'Authenticated' }, { status: 200 });
}
