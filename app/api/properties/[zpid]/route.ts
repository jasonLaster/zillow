import { NextRequest, NextResponse } from 'next/server';
import { getPropertyByZpid } from '@/lib/database';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ zpid: string }> }
) {
  try {
    const { zpid } = await params;
    const property = getPropertyByZpid(zpid);

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ property });
  } catch (error) {
    console.error('Error fetching property:', error);
    return NextResponse.json(
      { error: 'Failed to fetch property' },
      { status: 500 }
    );
  }
} 