import { Chat } from "@/components/Chat/Chat";
import { ModeToggle } from "@/components/ThemeToggle/ModeToggle";

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-between">
      <div className="p-4 flex h-14 container items-center justify-between  supports-backdrop-blur:bg-background/60 sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <span className="font-bold">DocsMind</span>
        <ModeToggle />
      </div>
      <div className="flex flex-1 py-4 w-full container">
        <div className="w-full">
          <Chat />
        </div>
      </div>
    </main>
  );
}
