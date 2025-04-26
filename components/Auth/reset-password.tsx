'use client';

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle2, Key, Eye, EyeOff, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

enum ResetStatus {
  VALIDATING = "validating", // Checking if token is valid
  READY = "ready",           // Token is valid, show password form
  SUCCESS = "success",       // Password successfully reset
  ERROR = "error"            // Error occurred (invalid/expired token)
}

export default function ResetPassword() {
  const [status, setStatus] = useState<ResetStatus>(ResetStatus.VALIDATING);
  const [message, setMessage] = useState<string>("Validating your reset link...");
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const token = searchParams.get("token");
  const { isLoggedIn, logout } = useAuth();

  useEffect(() => {
    // Check if user is logged in
    if (isLoggedIn) {
      router.push('/admin');
    } else {
      logout(); // Log out the user if they are already logged in
      router.push('/login');
    }
  }, [isLoggedIn, router]);

  // Validate token on component mount
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setStatus(ResetStatus.ERROR);
        setMessage("Invalid password reset link. No token was provided.");
        return;
      }

      try {
        // In a real app, you would make an API call to validate the token
        // const response = await fetch(`/api/validate-reset-token?token=${token}`);
        // const data = await response.json();
        
        // Simulate API call with timeout
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // For demo purposes, randomly decide if token is valid
        const isValid = Math.random() > 0.2; // 80% chance token is valid
        
        if (isValid) {
          setStatus(ResetStatus.READY);
          setMessage("Please enter your new password.");
        } else {
          setStatus(ResetStatus.ERROR);
          setMessage("This password reset link is invalid or has expired.");
        }
      } catch (error) {
        console.error("Error validating token:", error);
        setStatus(ResetStatus.ERROR);
        setMessage("An error occurred while validating your reset link. Please try again.");
      }
    };

    validateToken();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Password validation
    if (password.length < 6) {
      toast({
        title: "Weak password",
        description: "Password must be at least 6 characters",
        variant: "destructive"
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please ensure both passwords match",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In a real app, send the new password and token to your API
      // const response = await fetch('/api/reset-password', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ token, password })
      // });
      // const data = await response.json();
      
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo purposes, assume success
      setIsLoading(false);
      setStatus(ResetStatus.SUCCESS);
      setMessage("Your password has been successfully reset!");
      
      toast({
        title: "Password reset successful!",
        description: "You can now log in with your new password.",
      });
      
      // In a real app, you might want to redirect after a short delay
      // setTimeout(() => router.push('/login'), 3000);
    } catch (error) {
      console.error("Error resetting password:", error);
      setIsLoading(false);
      
      toast({
        title: "Failed to reset password",
        description: "An error occurred. Please try again later.",
        variant: "destructive"
      });
    }
  };

  const renderContent = () => {
    switch (status) {
      case ResetStatus.VALIDATING:
        return (
          <div className="flex flex-col items-center justify-center space-y-4 py-10">
            <div className="animate-pulse">
              <Key className="h-16 w-16 text-primary opacity-70" />
            </div>
            <p className="text-center text-muted-foreground">{message}</p>
            <div className="pt-2">
              <Loader2 className="animate-spin h-6 w-6 text-primary" />
            </div>
          </div>
        );

      case ResetStatus.READY:
        return (
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Password must be at least 6 characters long.
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Resetting Password...
                </>
              ) : (
                "Reset Password"
              )}
            </Button>
          </form>
        );

      case ResetStatus.SUCCESS:
        return (
          <div className="flex flex-col items-center justify-center space-y-4 py-8">
            <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/30">
              <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-medium text-green-600 dark:text-green-400">
                Password Reset Successful
              </h3>
              <p className="mt-2 text-muted-foreground">{message}</p>
            </div>
            <div className="w-full max-w-xs pt-4">
              <Link href="/login">
                <Button className="w-full">
                  Continue to Login
                </Button>
              </Link>
            </div>
          </div>
        );

      case ResetStatus.ERROR:
      default:
        return (
          <div className="flex flex-col items-center justify-center space-y-4 py-8">
            <div className="rounded-full bg-red-100 p-3 dark:bg-red-900/30">
              <AlertCircle className="h-12 w-12 text-red-600 dark:text-red-400" />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-medium text-red-600 dark:text-red-400">
                Reset Error
              </h3>
              <p className="mt-2 text-muted-foreground">{message}</p>
            </div>
            <div className="w-full max-w-xs space-y-3 pt-4 flex flex-col">
              <Link href="/forgot-password">
                <Button className="w-full">
                  Request New Reset Link
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
          <CardTitle className="text-2xl">Reset Password</CardTitle>
          <CardDescription>
            Set a new password for your account
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {renderContent()}
        </CardContent>
        
        <CardFooter className="border-t p-4 flex justify-center">
          <p className="text-xs text-muted-foreground">
            Remember your password? <Link href="/login" className="text-primary hover:underline">Sign in</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}