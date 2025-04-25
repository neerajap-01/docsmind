import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { FileIcon, Loader2, UploadIcon, XIcon } from "lucide-react";
import { cn } from "@/utils/core.utils";
import { uploadMultipleFiles } from "@/services/upload.service";
import { formatFileSize } from "@/utils/core.utils";
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-explicit-any, import/extensions
import { useToast } from "@/hooks/use-toast.ts";

interface FileUploadProps {
  onFileProcessed: (filename: string) => void;
  mode: "vector" | "context";
}

const processStreamedProgress = async (
  response: Response, 
  setIsUploading: React.Dispatch<React.SetStateAction<boolean>>, 
  setProgress: React.Dispatch<React.SetStateAction<number>>,
  setFilename:  (filename: string) => void,
  setActionCompleted: React.Dispatch<React.SetStateAction<{
    isError: boolean;
    message: string;
    isComplete: boolean;
  }>>,
) => {
  const reader = response.body?.getReader();
  if (!reader) {
    console.error('Reader was not found');
    return;
  }
  try {
    let count = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        setIsUploading(false);
        setActionCompleted({
          isError: false,
          message: "File processed successfully",
          isComplete: true,
        })
        break;
      }

      const data = new TextDecoder().decode(value);
      const { filename, totalChunks, chunksUpserted, isComplete } = JSON.parse(data);
      const currentProgress = Math.round((chunksUpserted / totalChunks) * 100);
      setProgress(currentProgress);
      // setFilename(`${filename} [${chunksUpserted}/${totalChunks}]`)
      if(count === 0) {
        const parsedFilename = filename.split("-%-")?.[0] ?? 'Sample-name.pdf';
        setFilename(parsedFilename);
        count++;
      }
    }
  } catch (error) {
    console.error("Error reading response: ", error);
    setActionCompleted({
      isError: true,
      message: "Error processing file",
      isComplete: true,
    })
  } finally {
    reader.releaseLock();
  }
}

export function FileUpload({ onFileProcessed, mode }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [actionCompleted, setActionCompleted] = useState<{
    isError: boolean;
    message: string;
    isComplete: boolean;
  }>({
    isError: false,
    message: "",
    isComplete: false,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Check if it's a PDF or text file
      if (
        selectedFile.type === "application/pdf" ||
        selectedFile.type === "text/plain" ||
        selectedFile.name.endsWith(".txt")
      ) {
        setFile(selectedFile);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF or text file.",
          variant: "destructive",
        });
      }
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      if (
        droppedFile.type === "application/pdf" ||
        droppedFile.type === "text/plain" ||
        droppedFile.name.endsWith(".txt")
      ) {
        setFile(droppedFile);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF or text file.",
          variant: "destructive",
        });
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const clearFile = () => {
    setFile(null);
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const processFile = async () => {
    if (!file) return;
  
    setIsUploading(true);
    
    try {
      const response = await uploadMultipleFiles([file]);
      await processStreamedProgress(response, setIsUploading, setProgress, onFileProcessed, setActionCompleted);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process file",
        variant: "destructive",
      });
      setIsUploading(false);
    }
  };

  const resetActionState = () => {
    setActionCompleted({
      isError: false,
      message: "",
      isComplete: false,
    });
    clearFile();
  }

  const getUploadingText = () => {
    if (isUploading) {
      return (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {mode === "vector" ? "Vectorizing..." : "Processing..."}
        </>
      );
    }
  
    if (actionCompleted.isComplete) {
      // Schedule reset after displaying the message
      setTimeout(resetActionState, 2000);

      // toast({
      //   title: actionCompleted.isError ? "Error" : "Success",
      //   description: actionCompleted.isError 
      //   ? 'Failed to process file'
      //   : 'File processed successfully',
      //   variant: actionCompleted.isError ? "destructive" : "default",
      //   duration: 2000,
      // })
      
      // Return appropriate message based on error state
      return actionCompleted.isError 
        ? 'Failed to process file'
        : 'File processed successfully';
    }
  
    // Default state text
    return mode === "vector" ? "Vectorize File" : "Use as Context";
  };

  return (
    <div className="space-y-4">
      {!file ? (
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-muted/50 transition-colors",
          )}
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept=".pdf,.txt,text/plain,application/pdf"
          />
          <UploadIcon className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
          <p className="text-sm font-medium mb-1">
            Drag and drop or click to upload
          </p>
          <p className="text-xs text-muted-foreground">
            Supported formats: PDF, TXT (Max 10MB)
          </p>
        </div>
      ) : (
        <div className="border rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileIcon className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm font-medium truncate max-w-[200px]">
                  {file.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(file.size)}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={clearFile}
              disabled={isUploading}
            >
              <XIcon className="h-4 w-4" />
            </Button>
          </div>
          
          {progress > 0 && progress < 100 && (
            <div className="space-y-1">
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-right text-muted-foreground">
                {progress}%
              </p>
            </div>
          )}
          
          <Button 
            className="w-full" 
            onClick={processFile} 
            disabled={isUploading}
          >
            {getUploadingText()}
          </Button>
        </div>
      )}
    </div>
  );
}