'use client';

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Menu, 
  X, 
  Home, 
  MessageSquare, 
  Settings, 
  User, 
  LogOut,
  Shield,
  ChevronRight,
  ChevronLeft
} from "lucide-react";
import { cn } from "@/utils/core.utils";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ThemeToggle } from "@/theme/theme-toggle";
import { useAuth } from "@/hooks/use-auth";

export default function AuthRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const isMobile = useIsMobile();
  const pathname = usePathname();
  const { isLoggedIn, logout } = useAuth();
  const sidebarRef = useRef<HTMLDivElement>(null);
  
  // Close sidebar when route changes on mobile
  useEffect(() => {
    if (isMobile && isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  }, [pathname, isMobile]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        isMobile && 
        isSidebarOpen && 
        sidebarRef.current && 
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setIsSidebarOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobile, isSidebarOpen]);
  
  const navigationItems = [
    { name: "Dashboard", path: "/", icon: Home },
    { name: "Chat", path: "/chat", icon: MessageSquare },
    { name: "Admin Panel", path: "/admin", icon: Shield },
  ];
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full flex justify-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 lg:px-0">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
            <Link href="/" className="flex items-center gap-2">
              <span className="bg-primary h-8 w-8 rounded-md flex items-center justify-center text-primary-foreground font-bold">AI</span>
              <span className="text-xl font-bold inline-block">DocsMind</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            {!isLoggedIn && (
              <div className="items-center gap-2 hidden lg:flex">
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

      <div className="flex flex-1 relative lg:max-h-[calc(100vh-4rem)]">
        {/* Sidebar - overlay on mobile, side panel on desktop */}
        <aside
          ref={sidebarRef}
          className={cn(
            "fixed inset-y-0 left-0 z-999999 transform border-r bg-background transition-all duration-200 ease-in-out flex flex-col lg:translate-x-0 lg:static lg:h-auto",
            isSidebarOpen ? "translate-x-0" : "-translate-x-full",
            isSidebarCollapsed ? "w-[5rem]" : "w-64"
          )}
        >
          <div className={cn(
            "flex h-16 items-center border-b px-4 lg:px-6",
            isSidebarCollapsed ? "justify-center" : "justify-between"
          )}>
            {!isSidebarCollapsed && (
              <span className="text-lg font-semibold">Menu</span>
            )}
            <div className="flex items-center">
              {!isSidebarCollapsed && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSidebarCollapsed(true)}
                  className="hidden lg:flex"
                >
                  <ChevronLeft className="h-5 w-5" />
                  <span className="sr-only">Collapse sidebar</span>
                </Button>
              )}
              {/* Collapsed toggle button */}
              {isSidebarCollapsed && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSidebarCollapsed(false)}
                  className="hidden lg:flex"
                >
                  <ChevronRight className="h-5 w-5" />
                  <span className="sr-only">Expand sidebar</span>
                </Button>
              )}

              {/* Close button for mobile */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSidebarOpen(false)}
                className="lg:hidden"
              >
                <X className="h-5 w-5" />
                <span className="sr-only">Close menu</span>
              </Button>
            </div>
          </div>
          <nav className="p-4 space-y-1 flex-1">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  "flex items-center gap-3 rounded-md text-sm font-medium transition-colors",
                  pathname === item.path
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-muted text-foreground/80 hover:text-foreground",
                  isSidebarCollapsed 
                    ? "justify-center h-12 w-12 p-0 mx-auto" 
                    : "px-3 py-2"
                )}
                onClick={() => isMobile && setIsSidebarOpen(false)}
                title={isSidebarCollapsed ? item.name : undefined}
              >
                <item.icon className="h-5 w-5" />
                {!isSidebarCollapsed && <span>{item.name}</span>}
              </Link>
            ))}
          </nav>
          
          {/* Profile section at bottom */}
          <div className={cn(
            "p-4 border-t flex z-999999",
            isSidebarCollapsed ? "justify-center" : "items-center"
          )}>
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className={cn(
                    "cursor-pointer",
                    isSidebarCollapsed ? "p-0" : "w-full justify-start"
                  )}>
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg" alt="User" />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    {!isSidebarCollapsed && (
                      <span className="ml-2 text-sm font-medium">User Profile</span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className={cn(
                "space-y-2",
                isSidebarCollapsed ? "flex flex-col items-center" : "w-full"
              )}>
                {isSidebarCollapsed ? (
                  <Link href="/login">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 rounded-full"
                      title="Login"
                    >
                      <User className="h-5 w-5" />
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/login">Login</Link>
                    </Button>
                    <Button asChild className="w-full">
                      <Link href="/signup">Sign Up</Link>
                    </Button>
                  </>
                )}
              </div>
            )}
          </div>
        </aside>

        {/* Backdrop overlay for mobile */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <main className="flex-1 overflow-auto p-6 w-full">
          {children}
        </main>
      </div>
    </div>
  );
}