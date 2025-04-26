import { NextRequest, NextResponse } from 'next/server';

export function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const token = searchParams.get('token');
  const error = searchParams.get('error');
  const source = searchParams.get('source') || 'unknown';
  
  // Handle error case
  if (error || !token) {
    const errorUrl = new URL('/auth/error', request.url);
    errorUrl.searchParams.set('source', source);
    
    if (error) {
      errorUrl.searchParams.set('message', error);
    }
    
    return NextResponse.redirect(errorUrl);
  }
  
  // Handle success case
  const successUrl = new URL('/auth/success', request.url);
  
  // Forward provider info if present
  const provider = searchParams.get('provider');
  if (provider) {
    successUrl.searchParams.set('provider', provider);
  }
  
  return NextResponse.redirect(successUrl);
}