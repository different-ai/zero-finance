import { auth } from '@/app/(auth)/auth';
import { addOCRData, queryOCRData, type Frame } from '@/lib/screenpipe/client';

export async function POST(request: Request) {
  const session = await auth();
  
  if (!session?.user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { device, frames }: { device: string; frames: Frame[] } = await request.json();
  
  try {
    await addOCRData(device, frames);
    return new Response('OCR data added', { status: 200 });
  } catch (error) {
    return new Response('Failed to add OCR data', { status: 500 });
  }
}

export async function GET(request: Request) {
  const session = await auth();
  
  if (!session?.user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  
  if (!query) {
    return new Response('Query parameter required', { status: 400 });
  }

  try {
    const results = await queryOCRData({
      q: query,
      startTime: searchParams.get('startTime') || undefined,
      endTime: searchParams.get('endTime') || undefined,
      limit: Number(searchParams.get('limit')) || undefined,
    });
    
    return Response.json(results);
  } catch (error) {
    return new Response('Failed to query OCR data', { status: 500 });
  }
} 