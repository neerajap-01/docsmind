import { JSONValue, Message } from "ai";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formattedText(inputText: string) {
  return inputText
    .replace(/\n+/g, " ") // Replace multiple consecutive new lines with a single space
    .replace(/(\w) - (\w)/g, "$1$2") // Join hyphenated words together
    .replace(/\s+/g, " "); // Replace multiple consecutive spaces with a single space
}

export function scrollToBottom(containerRef: React.RefObject<HTMLElement> | null) {
  if (containerRef?.current) {
    const lastMessage = containerRef.current.lastElementChild;
    if (lastMessage) {
      const scrollOptions: ScrollIntoViewOptions = {
        behavior: "smooth",
        block: "end",
      };
      lastMessage.scrollIntoView(scrollOptions);
    }
  }
}

export const initialMessages: Message[] = [
  {
    role: "assistant",
    id: "0",
    content:
      "Hi! I am your PDF assistant. I am happy to help with your questions about your Resume.",
  },
];

// Maps the sources with the right ai-message
export const getSources = (data: JSONValue[], role: string, index: number) => {
  if (role === "assistant" && index >= 2 && (index - 2) % 2 === 0) {
    // const sourcesIndex = (index - 2) / 2;
    // if (data[sourcesIndex] && data[sourcesIndex].sources) {
    //   return data[sourcesIndex].sources;
    // }
  }
  return [];
};

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const formatFileSize = (bytes: number): string => {
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  // Round to 2 decimal places if MB or GB, whole numbers for B and KB
  const formattedSize = unitIndex > 1 ? size.toFixed(2) : Math.round(size);
  return `${formattedSize} ${units[unitIndex]}`;
};

export const getBaseUrl = () => {
  // Check if we're running on the client side
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  // Default value for server-side
  return process.env.BASE_URL || '';
};