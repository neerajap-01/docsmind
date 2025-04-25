import { Button } from "@/components/ui/button";
import { cn } from "@/utils/core.utils";
import { Box, Layers } from "lucide-react";

interface ModeToggleProps {
  mode: "vector" | "context";
  onModeChange: (mode: "vector" | "context") => void;
}

export function ModeToggle({ mode, onModeChange }: ModeToggleProps) {
  return (
    <div className="flex rounded-lg overflow-hidden border">
      <Button
        variant="ghost"
        className={cn(
          "flex-1 rounded-none border-r",
          mode === "vector" && "bg-primary text-primary-foreground"
        )}
        onClick={() => onModeChange("vector")}
      >
        <Layers className="mr-2 h-4 w-4" />
        Vectorize
      </Button>
      <Button
        variant="ghost"
        className={cn(
          "flex-1 rounded-none",
          mode === "context" && "bg-primary text-primary-foreground"
        )}
        onClick={() => onModeChange("context")}
      >
        <Box className="mr-2 h-4 w-4" />
        Context
      </Button>
    </div>
  );
}
