'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/hooks/use-auth';

enum AuthStatus {
  PROCESSING = 'processing',
  SUCCESS = 'success',
  ERROR = 'error'
}

export default function AuthSuccess() {
  const [status, setStatus] = useState<AuthStatus>(AuthStatus.PROCESSING);
  const [message, setMessage] = useState<string>('Processing your authentication...');
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { login } = useAuth();
  
  // Get query parameters from the URL
  const provider = searchParams.get('source');
  // Check for token in params and then cookies.
  const token = searchParams.get('token') ?? document.cookie
          .split('; ')
          .find(row => row.startsWith('auth_token='))
          ?.split('=')[1];

  useEffect(() => {
    const handleAuth = async () => {
      try {
        if (!token) {
          setStatus(AuthStatus.ERROR);
          setMessage('Authentication token not found. Please try again.');
          toast({
            title: 'Authentication Error',
            description: 'Token not found. Please try again.',
            variant: 'destructive',
          });
          return;
        }
        login(token);
        setStatus(AuthStatus.SUCCESS);
        setMessage(`Successfully authenticated with ${provider}`);
        
        toast({
          title: 'Authentication Successful',
          description: `You've successfully signed in with ${provider}`,
        });
        
        // Redirect to home page after a short delay
        setTimeout(() => {
          router.push('/admin');
        }, 1500);
      } catch (error) {
        console.error('Error during authentication process:', error);
        setStatus(AuthStatus.ERROR);
        setMessage('Failed to process authentication. Please try again.');
        
        toast({
          title: 'Authentication Error',
          description: 'There was a problem completing the authentication process',
          variant: 'destructive',
        });
      }
    };

    handleAuth();
  }, [token, provider, router, toast]);

  // Render different content based on status
  const renderContent = () => {
    switch (status) {
      case AuthStatus.PROCESSING:
        return (
          <div className="flex flex-col items-center justify-center space-y-4 py-10">
            <Loader2 className="h-16 w-16 text-primary animate-spin" />
            <p className="text-center text-muted-foreground">{message}</p>
          </div>
        );
      
      case AuthStatus.SUCCESS:
        return (
          <div className="flex flex-col items-center justify-center space-y-4 py-8">
            <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/30">
              <svg
                className="h-12 w-12 text-green-600 dark:text-green-400"
                fill="none"
                height="24"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-medium text-green-600 dark:text-green-400">
                Authentication Successful
              </h3>
              <p className="mt-2 text-muted-foreground">{message}</p>
              <p className="mt-1 text-muted-foreground">Redirecting you to the app...</p>
            </div>
          </div>
        );
      
      case AuthStatus.ERROR:
      default:
        return (
          <div className="flex flex-col items-center justify-center space-y-4 py-8">
            <div className="rounded-full bg-red-100 p-3 dark:bg-red-900/30">
              <svg
                className="h-12 w-12 text-red-600 dark:text-red-400"
                fill="none"
                height="24"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" x2="12" y1="8" y2="12" />
                <line x1="12" x2="12.01" y1="16" y2="16" />
              </svg>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-medium text-red-600 dark:text-red-400">
                Authentication Failed
              </h3>
              <p className="mt-2 text-muted-foreground">{message}</p>
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
        );
    }
  };

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
          <CardTitle className="text-2xl">Authentication</CardTitle>
          <CardDescription>
            Processing your sign in request
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {renderContent()}
        </CardContent>
        
        <CardFooter className="border-t p-4 flex justify-center">
          <p className="text-xs text-muted-foreground">
            Having trouble? <Link href="/contact" className="text-primary hover:underline">Contact Support</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}