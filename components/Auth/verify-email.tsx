'use client';

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { BadgeCheck, AlertCircle, MailCheck, ArrowRight } from "lucide-react";
import { verifyEmailBFF } from "@/services/auth.service";
import { useRouter } from "next/router";
import { useAuth } from "@/hooks/use-auth";

enum VerificationStatus {
  LOADING = "loading",
  SUCCESS = "success",
  ERROR = "error",
  EXPIRED = "expired"
}

export default function VerifyEmail() {
  const [status, setStatus] = useState<VerificationStatus>(VerificationStatus.LOADING);
  const [message, setMessage] = useState("Verifying your email address...");
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
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
  
  useEffect(() => {
    const controller = new AbortController();
    const verifyEmail = async () => {
      if (!token) {
        setStatus(VerificationStatus.ERROR);
        setMessage("Invalid verification link. No token was provided.");
        return;
      }
      try {
        await handleVerify(token, controller.signal);
      } catch (error: unknown) {
        // Don't update state if aborted
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error("Error verifying email:", error);
          setStatus(VerificationStatus.ERROR);
          setMessage("Failed to verify your email. Please try again later.");
        }
      }
    };

    verifyEmail();

    return () => {
      controller.abort();
    };
  }, [token]);

  async function handleVerify(token: string, signal: AbortSignal) {
    try {
      const respone = await verifyEmailBFF(token, signal);
    
      if (respone.error === 0) {
        setStatus(VerificationStatus.SUCCESS);
        setMessage("Your email has been successfully verified!");
      } else {
        // Simulate either expired or invalid token
        // const isExpired = Math.random() > 0.5;
        // setStatus(isExpired ? VerificationStatus.EXPIRED : VerificationStatus.ERROR);
        // setMessage(isExpired 
        //   ? "This verification link has expired. Please request a new one."
        //   : "Invalid or already used verification link.");
        setStatus(VerificationStatus.ERROR);
        setMessage("Invalid or already used verification link.");
      }
    } catch (error) {
      console.error("Error verifying email:", error);
      setStatus(VerificationStatus.ERROR);
      setMessage("Failed to verify your email. Please try again later.");
    }
  }

  const renderContent = () => {
    switch (status) {
      case VerificationStatus.LOADING:
        return (
          <div className="flex flex-col items-center justify-center space-y-4 py-10">
            <div className="animate-pulse">
              <MailCheck className="h-16 w-16 text-primary opacity-70" />
            </div>
            <p className="text-center text-muted-foreground">{message}</p>
            <div className="pt-2">
              <Spinner />
            </div>
          </div>
        );

      case VerificationStatus.SUCCESS:
        return (
          <div className="flex flex-col items-center justify-center space-y-4 py-8">
            <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/30">
              <BadgeCheck className="h-12 w-12 text-green-600 dark:text-green-400" />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-medium text-green-600 dark:text-green-400">Email Verified</h3>
              <p className="mt-2 text-muted-foreground">{message}</p>
            </div>
            <div className="w-full max-w-xs pt-4 flex flex-col">
              <Link href="/login">
                <Button className="w-full">
                  Continue to Login
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        );

      case VerificationStatus.EXPIRED:
        return (
          <div className="flex flex-col items-center justify-center space-y-4 py-8">
            <div className="rounded-full bg-amber-100 p-3 dark:bg-amber-900/30">
              <AlertCircle className="h-12 w-12 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-medium text-amber-600 dark:text-amber-400">Link Expired</h3>
              <p className="mt-2 text-muted-foreground">{message}</p>
            </div>
            <div className="w-full max-w-xs space-y-3 pt-4 flex flex-col">
              <Button className="w-full" variant="outline">
                Resend Verification Email
              </Button>
              <Link href="/login">
                <Button className="w-full" variant="secondary">
                  Back to Login
                </Button>
              </Link>
            </div>
          </div>
        );

      case VerificationStatus.ERROR:
      default:
        return (
          <div className="flex flex-col items-center justify-center space-y-4 py-8">
            <div className="rounded-full bg-red-100 p-3 dark:bg-red-900/30">
              <AlertCircle className="h-12 w-12 text-red-600 dark:text-red-400" />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-medium text-red-600 dark:text-red-400">Verification Failed</h3>
              <p className="mt-2 text-muted-foreground">{message}</p>
            </div>
            <div className="w-full max-w-xs space-y-3 pt-4 flex flex-col">
              <Link href="/signup">
                <Button className="w-full">
                  Sign Up Again
                </Button>
              </Link>
              <Link href="/login">
                <Button className="w-full" variant="outline">
                  Back to Login
                </Button>
              </Link>
              <Link href="/">
                <Button className="w-full" variant="ghost">
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
          <CardTitle className="text-2xl">Email Verification</CardTitle>
          <CardDescription>
            Verifying your account email address
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {renderContent()}
        </CardContent>
        
        <CardFooter className="border-t p-4 flex justify-center">
          <p className="text-xs text-muted-foreground">
            Need help? <Link href="/support" className="text-primary hover:underline">Contact Support</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}