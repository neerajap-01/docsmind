'use client';

import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Search, Home, FileQuestion, HelpCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="inline-block">
            <div className="flex items-center gap-2">
              <span className="bg-primary h-8 w-8 rounded-md flex items-center justify-center text-primary-foreground font-bold">AI</span>
              <span className="text-xl font-bold">DocsMind</span>
            </div>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-3xl mx-auto">
          <Card className="border-none shadow-xl">
            <CardContent className="pt-9 px-6 pb-8 flex flex-col items-center text-center">
              <div className="relative mb-6">
                <div className="text-9xl font-extrabold text-primary/10">404</div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Search className="h-16 w-16 text-muted-foreground/70" />
                </div>
              </div>
              
              <h1 className="text-3xl font-bold tracking-tight mb-2">Page Not Found</h1>
              
              <p className="text-muted-foreground mb-8 max-w-md">
                The page you're looking for doesn't exist or has been moved. 
                Maybe you mistyped the URL or the link you followed is outdated.
              </p>
              
              <div className="space-y-4 w-full max-w-md">
                <Button asChild className="w-full">
                  <Link href="/">
                    <Home className="mr-2 h-4 w-4" />
                    Back to Home
                  </Link>
                </Button>
                
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" asChild>
                    <Link href="/docs">
                      <FileQuestion className="mr-2 h-4 w-4" />
                      Documentation
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/contact">
                      <HelpCircle className="mr-2 h-4 w-4" />
                      Contact Support
                    </Link>
                  </Button>
                </div>
                
                <div className="pt-4 border-t">
                  <Button variant="ghost" asChild className="w-full">
                    <Link href="/">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Go Back
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="text-center mt-8 text-sm text-muted-foreground">
            <p>
              Looking for something specific? Try our{' '}
              <Link href="/search" className="text-primary hover:underline">
                search page
              </Link>{' '}
              or{' '}
              <Link href="/sitemap" className="text-primary hover:underline">
                site map
              </Link>
              .
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}