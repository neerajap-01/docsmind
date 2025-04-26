'use client';

import { SignupForm } from "@/components/Auth/signup-form";

const Signup = () => {
  return (
    <div className="max-w-5xl mx-auto pt-8 md:pt-16">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Create Your Account</h1>
        <p className="text-muted-foreground mt-2">Join our platform to get started</p>
      </div>
      <SignupForm />
    </div>
  );
};

export default Signup;