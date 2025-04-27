import { NextRequest } from 'next/server';
import { ADMINPANEL, SERVER } from "@/contants/endpoints.contants";
import { fetchData } from '@/utils/fetchData';

// Configure options for this API route
export const dynamic = 'force-dynamic';
export const maxDuration = 60; // 5 minutes timeout for file uploads

export async function POST(req: NextRequest) {
  try {
    // Get the form data from the request
    const formData = await req.formData();
    
    // Add any server-side validation here if needed
    const files = formData.getAll('docs');
    if (!files || files.length === 0) {
      return Response.json({ error: 'No files provided' }, { status: 400 });
    }
    
    // Forward the request to the backend
    const backendResponse = await fetchData(
      SERVER,
      ADMINPANEL.uploadMultipleFiles(),
      'post',
      formData,
      {},
      {},
      true,
      true
    );
    
    // Return the backend response directly to preserve streaming
    return new Response(backendResponse.body, {
      status: backendResponse.status,
      statusText: backendResponse.statusText,
      headers: {
        'Content-Type': 'application/json',
        'Transfer-Encoding': 'chunked'
      }
    });
    
  } catch (error) {
    console.error('Error in upload API route:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}