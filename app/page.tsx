"use client";

import { Chat } from "@/components/Chat/Chat";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { ThemeToggle } from "@/theme/theme-toggle";
import Link from "next/link";

export default function Home() {
  const { isLoggedIn } = useAuth();

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-between">
      <header className="sticky top-0 z-50 w-full flex justify-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <span className="bg-primary h-8 w-8 rounded-md flex items-center justify-center text-primary-foreground font-bold">AI</span>
              <span className="text-xl font-bold hidden sm:inline-block">DocsMind</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            {!isLoggedIn && (
              <div className="flex items-center gap-2">
                <Button variant="ghost" asChild size="sm">
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>
      <div className="flex flex-1 py-4 w-full container">
        <div className="w-full">
          <Chat />
        </div>
      </div>
    </main>
  );
}
