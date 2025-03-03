import Balancer from "react-wrap-balancer";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Message } from "ai/react";
import ReactMarkdown from "react-markdown";
import { formattedText } from "@/lib/utils";

interface ChatLineProps extends Partial<Message> {
  sources: string[];
  isStreaming?: boolean;
}

export function ChatLine({
  role = "assistant",
  content,
  sources,
  isStreaming = false,
}: ChatLineProps) {
  if (!content) {
    return null;
  }

  return (
    <div>
      <Card className="mb-2">
        <CardHeader>
          <CardTitle
            className={
              role != "assistant"
                ? "text-amber-500 dark:text-amber-200"
                : "text-blue-500 dark:text-blue-200"
            }
          >
            {role == "assistant" ? "AI" : "You"}
            {isStreaming && <span className="ml-2 text-sm text-gray-500">(typing...)</span>}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm prose dark:prose-invert max-w-none">
          {role === "assistant" ? (
            <ReactMarkdown
              components={{
                a: ({ node, ...props }) => <a {...props} target="_blank" rel="noopener noreferrer" />,
                p: ({ node, ...props }) => <p {...props} className="my-2" />,
                ul: ({ node, ...props }) => <ul {...props} className="list-disc pl-6 my-2" />,
                ol: ({ node, ...props }) => <ol {...props} className="list-decimal pl-6 my-2" />,
                li: ({ node, ...props }) => <li {...props} className="my-1" />,
                h1: ({ node, ...props }) => <h1 {...props} className="text-xl font-bold my-3" />,
                h2: ({ node, ...props }) => <h2 {...props} className="text-lg font-bold my-3" />,
                h3: ({ node, ...props }) => <h3 {...props} className="text-md font-bold my-2" />,
              }}
            >
              {content}
            </ReactMarkdown>
          ) : (
            <div>{content}</div>
          )}
        </CardContent>
        <CardFooter>
          <CardDescription className="w-full">
            {sources && sources.length ? (
              <Accordion type="single" collapsible className="w-full">
                {sources.map((source, index) => (
                  <AccordionItem value={`source-${index}`} key={index}>
                    <AccordionTrigger>{`Source ${index + 1}`}</AccordionTrigger>
                    <AccordionContent>
                      <ReactMarkdown 
                        components={{ a: ({ ...props }) => <a {...props} target="_blank" /> }}
                      >
                        {formattedText(source)}
                      </ReactMarkdown>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <></>
            )}
          </CardDescription>
        </CardFooter>
      </Card>
    </div>
  );
}