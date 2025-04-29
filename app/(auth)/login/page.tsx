'use client';

import LoginForm from "@/components/Auth/login-form";

const Login = () => {
  return (
    <div className="max-w-5xl mx-auto pt-8 md:pt-16">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Welcome Back</h1>
        <p className="text-muted-foreground mt-2">Login to your account to continue</p>
      </div>
      <LoginForm />
    </div>
  );
};

export default Login;