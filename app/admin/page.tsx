'use client'

import { ModelSelector } from "@/components/Admin/model-selector";
import { useToast } from "@/hooks/use-toast";
import { FileUpload } from "@/components/Admin/file-upload";
import { ModeToggle } from "@/components/Admin/mode-toggle";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import AuthRouteLayout from "@/layout/main-layout";

// Mock model data
const AVAILABLE_MODELS = [
  {
    id: "gpt-3.5-turbo",
    name: "GPT-3.5 Turbo",
    description: "Fast and efficient for most tasks",
    supportedModes: ["vector", "context"]
  },
  {
    id: "gpt-4",
    name: "GPT-4",
    description: "Most powerful model for complex tasks",
    supportedModes: ["vector", "context"]
  },
  {
    id: "claude-2",
    name: "Claude 2",
    description: "Good for long-form content and reasoning",
    supportedModes: ["context"]
  },
  {
    id: "mixtral",
    name: "Mixtral 8x7B",
    description: "Open-source alternative with strong performance",
    supportedModes: ["vector", "context"]
  },
  {
    id: "embedding-ada",
    name: "Embedding Ada 002",
    description: "Specialized for vectorization tasks",
    supportedModes: ["vector"]
  }
];

const Admin = () => {
  const [mode, setMode] = useState<"vector" | "context">("vector");
  const [selectedModel, setSelectedModel] = useState("gpt-3.5-turbo");
  const [processedFiles, setProcessedFiles] = useState<{fileName: string, mode: string}[]>([]);
  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    if (processedFiles.length > 0 && !countdown) {
      setCountdown(60);
    }
  }, [processedFiles.length]);

  useEffect(() => {
    if (countdown === null) return;

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev === 1) {
          setProcessedFiles([]);
          return null;
        }
        return prev ? prev - 1 : null;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);
  const { toast } = useToast();

  const handleFileProcessed = (filename: string) => {
    // In a real app, this would call an API to process the file
    setProcessedFiles(prev => [
      ...prev,
      {
        fileName: filename,
        mode: mode
      }
    ]);
  };

  // Change model when mode changes if current model doesn't support the new mode
  const handleModeChange = (newMode: "vector" | "context") => {
    setMode(newMode);
    const currentModel = AVAILABLE_MODELS.find(m => m.id === selectedModel);
    if (currentModel && !currentModel.supportedModes.includes(newMode)) {
      // Find first model that supports the new mode
      const compatibleModel = AVAILABLE_MODELS.find(m => m.supportedModes.includes(newMode));
      if (compatibleModel) {
        setSelectedModel(compatibleModel.id);
        toast({
          title: "Model changed",
          description: `Switched to ${compatibleModel.name} because it supports ${newMode} mode.`,
        });
      }
    }
  };

  return (
    <AuthRouteLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold">Admin Control Panel</h1>
        
        <Tabs defaultValue="file-processing" className="space-y-6 mt-4">
          <TabsList>
            <TabsTrigger value="file-processing">File Processing</TabsTrigger>
            <TabsTrigger value="processed-files">Processed Files</TabsTrigger>
          </TabsList>
          
          <TabsContent value="file-processing">
            <Card>
              <CardHeader>
                <CardTitle>File Processing</CardTitle>
                <CardDescription>
                  Upload and process files for AI interaction
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Processing Mode</h3>
                  <ModeToggle mode={mode} onModeChange={handleModeChange} />
                  <p className="text-xs text-muted-foreground mt-2">
                    {mode === "vector" 
                      ? "Vectorize files to enable semantic search and retrieval" 
                      : "Use file content as context/system prompt for the AI model"}
                  </p>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">AI Model Selection</h3>
                  <ModelSelector 
                    models={AVAILABLE_MODELS}
                    selectedModel={selectedModel}
                    onSelectModel={setSelectedModel}
                    disabled={true}
                    activeMode={mode}
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    {mode === "vector" 
                      ? "Select a model optimized for vectorization" 
                      : "Select a model for context-based responses"}
                  </p>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Upload File</h3>
                  <FileUpload onFileProcessed={handleFileProcessed} mode={mode} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="processed-files">
            <Card>
              <CardHeader>
                <CardTitle>Processed Files</CardTitle>
                <CardDescription>
                  View and manage files that have been processed
                  {countdown && (
                    <span className="text-muted-foreground ml-2 text-[#ec4646]">
                      (Clearing in {countdown}s)
                    </span>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {processedFiles.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No files have been processed yet
                  </p>
                ) : (
                  <div className="space-y-4">
                    {processedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between border rounded-md p-3">
                        <div>
                          <p className="font-medium">{file.fileName}</p>
                          <p className="text-xs text-muted-foreground">
                            Processed as: {file.mode === "vector" ? "Vectorized" : "Context"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AuthRouteLayout>
  );
};

export default Admin;