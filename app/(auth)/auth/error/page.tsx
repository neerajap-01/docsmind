'use client';
import dynamic from "next/dynamic";

// Dynamically import the AuthError component to avoid server-side rendering issues
const AuthError = dynamic(() => import("@/components/Auth/authError"), {
  ssr: false,
});

export default function AuthErrorPage() {
  return <AuthError />;
}