'use client';

import dynamic from "next/dynamic";

// Use dynamic import with no SSR
const VerifyEmailContent = dynamic(() => import("@/components/Auth/verify-email"), {
  ssr: false,
});

export default function VerifyEmailPage() {
  return <VerifyEmailContent />;
}