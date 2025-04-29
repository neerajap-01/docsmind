"use client"
import { AuthProvider } from '@/hooks/use-auth';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider authGroup={true}>
      {children}
    </AuthProvider>
  );
}