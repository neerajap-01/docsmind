'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/hooks/use-auth';

export default function AuthError() {
  const searchParams = useSearchParams();
  const [errorSource, setErrorSource] = useState<string>('authentication');
  const [errorMessage, setErrorMessage] = useState<string>('An error occurred during authentication.');
  const { toast } = useToast();
  const { isLoggedIn, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    if (isLoggedIn) {
      router.push('/admin');
    } else {
      logout(); // Log out the user if they are already logged in
      router.push('/login');
    }
  }, [isLoggedIn, router]);
  
  const source = searchParams.get('source') || 'unknown';
  const message = searchParams.get('message');
  
  useEffect(() => {
    // Set error source name for display
    switch (source) {
      case 'google':
        setErrorSource('Google');
        break;
      case 'github':
        setErrorSource('GitHub');
        break;
      case 'email':
        setErrorSource('Email');
        break;
      default:
        setErrorSource('Authentication');
    }
    
    // Use custom message if provided
    if (message) {
      setErrorMessage(decodeURIComponent(message));
    } else {
      // Default error messages based on source
      switch (source) {
        case 'google':
          setErrorMessage('Failed to authenticate with Google. Please try again.');
          break;
        case 'github':
          setErrorMessage('Failed to authenticate with GitHub. Please try again.');
          break;
        case 'email':
          setErrorMessage('Failed to authenticate with email. Please check your credentials and try again.');
          break;
        default:
          setErrorMessage('An error occurred during authentication.');
      }
    }
    
    // Show toast notification
    toast({
      title: `${errorSource} Authentication Failed`,
      description: errorMessage,
      variant: 'destructive',
    });
  }, [source, message, errorSource, errorMessage, toast]);
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
      <div className="text-center mb-8">
        <Link href="/" className="inline-block">
          <div className="flex items-center gap-2">
            <span className="bg-primary h-8 w-8 rounded-md flex items-center justify-center text-primary-foreground font-bold">AI</span>
            <span className="text-xl font-bold">DocsMind</span>
          </div>
        </Link>
      </div>
      
      <Card className="w-full max-w-md mx-auto shadow-md overflow-hidden">
        <CardHeader className="space-y-1 pb-4 text-center">
          <CardTitle className="text-2xl">Authentication Failed</CardTitle>
          <CardDescription>
            There was a problem with {errorSource.toLowerCase()} authentication
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="flex flex-col items-center justify-center space-y-4 py-8">
            <div className="rounded-full bg-red-100 p-3 dark:bg-red-900/30">
              <AlertCircle className="h-12 w-12 text-red-600 dark:text-red-400" />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-medium text-red-600 dark:text-red-400">
                Authentication Error
              </h3>
              <p className="mt-2 text-muted-foreground">{errorMessage}</p>
            </div>
            <div className="w-full max-w-xs space-y-3 pt-4 flex flex-col">
              <Link href="/login">
                <Button className="w-full">
                  Return to Login
                </Button>
              </Link>
              <Link href="/">
                <Button className="w-full" variant="outline">
                  Go to Homepage
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="border-t p-4 flex justify-center">
          <p className="text-xs text-muted-foreground">
            Need help? <Link href="/contact" className="text-primary hover:underline">Contact Support</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}