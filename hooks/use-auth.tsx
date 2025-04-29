"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';

// Define the interface for the context value
export interface AuthContextValue {
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue>({
  isLoggedIn: false,
  isLoading: true,
  login: () => {},
  logout: () => {},
});

// Provider component
export function AuthProvider({ 
  children,
  authGroup = false // Is this an auth group (login, signup, etc)?
}: { 
  children: ReactNode,
  authGroup?: boolean 
}) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Handle auth redirections
  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      // Check if token exists in cookies
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth_token='))
        ?.split('=')[1];
      
      if (token) {
        console.log('User is authenticated');
        setIsLoggedIn(true);
        
        // If user is logged in and tries to access auth pages (part of authGroup), redirect to homepage
        if (authGroup) {
          console.log('Logged in user trying to access auth page, redirecting to home');
          router.push('/');
        }
      } else {
        console.log('User is not authenticated');
        setIsLoggedIn(false);
        
        // If this layout is not an auth group and user isn't authenticated, redirect to login
        if (!authGroup) {
          console.log('Non-authenticated user trying to access protected page, redirecting to login');
          router.push('/login');
        }
      }
      
      setIsLoading(false);
    };

    checkAuthAndRedirect();
  }, [router, authGroup, pathname]);

  const login = (token: string) => {
    // Set the cookie
    document.cookie = `auth_token=${token}; path=/; max-age=${60 * 60 * 24 * 7}`; // 7 days
    setIsLoggedIn(true);
    router.push('/');
  };

  const logout = () => {
    // Remove the cookie
    document.cookie = 'auth_token=; path=/; max-age=0';
    setIsLoggedIn(false);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook for using the auth context
export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}