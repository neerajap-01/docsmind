'use client';

import dynamic from "next/dynamic";

// Use dynamic import with no SSR
const AuthSuccess = dynamic(() => import('@/components/Auth/authSuccess'), {
  ssr: false
});

export default function AuthSuccessPage() {
  return <AuthSuccess />;
}