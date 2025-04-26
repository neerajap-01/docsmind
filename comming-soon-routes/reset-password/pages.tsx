import ResetPassword from "@/components/Auth/reset-password";
import { notFound } from 'next/navigation';

export default function ResetPasswordPage() {
  // If you want to make this page not found:
  notFound();
  
  // This won't execute after notFound()
  // return <ResetPassword />;
}