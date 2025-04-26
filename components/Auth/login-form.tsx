import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Loader2, Github, Mail } from "lucide-react";
import Link from "next/link";
import { loginUserBFF } from "@/services/auth.service";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { env } from "@/lib/config";
import GoogleIcon from "@/icons/google-icon";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
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

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Invalid password",
        description: "Password must be at least 6 characters",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      await handleEmailLogin();
    } catch (error) {
      toast({
        title: "Login failed",
        description: "An error occurred while logging in. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  async function handleEmailLogin() {
    try {
      const payload: UserLoginPayload = {
        email,
        password,
      };

      const response = await loginUserBFF(payload);

      if (response.statusCode === 200) {
        toast({
          title: "Login successful",
          description: "Welcome back! You are now logged in.",
        });
        // Redirect to dashboard or home page
        setTimeout(() => {
          router.push("/admin");
        }, 1500);
      } else {
        toast({
          title: "Login failed",
          description: response.message || "An error occurred. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: "An error occurred while logging in. Please try again.",
        variant: "destructive"
      });
    }
  }

  const handleSocialLogin = (provider: string) => {
    setIsLoading(true);
        
    // Get the base URL from an environment variable or hardcode it based on your setup
    const baseURL = env.API_ENDPOINT;
    
    // Construct the OAuth URL
    const authURL = `${baseURL}/api/auth/${provider.toLowerCase()}`;
    
    // Redirect to the OAuth provider
    window.location.href = authURL;
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
        <CardDescription className="text-center">
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Social Login Options */}
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" className="w-full" onClick={() => handleSocialLogin("Google")}>
            <GoogleIcon className="mr-2 h-4 w-4" />
            Google
          </Button>
          <Button variant="outline" className="w-full" onClick={() => handleSocialLogin("GitHub")}>
            <Github className="mr-2 h-4 w-4" />
            GitHub
          </Button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>

        {/* Email Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                Forgot password?
              </Link>
            </div>
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
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              <>
                <Mail className="mr-2 h-4 w-4" />
                Login with Email
              </>
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4 pt-0">
        <div className="text-center text-sm">
          Don't have an account?{" "}
          <Link href="/signup" className="text-primary hover:underline font-medium">
            Sign up
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}