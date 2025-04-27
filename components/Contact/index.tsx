'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  AtSign, 
  MessageSquare, 
  Send, 
  Github,
  Linkedin,
  CheckCircle2,
  ArrowRight,
  X
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [subject, setSubject] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill out all required fields",
        variant: "destructive"
      });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Message sent!",
        description: "We'll get back to you as soon as possible.",
      });
      
      setIsSubmitted(true);
      // Reset form (not needed since we're showing success state)
      // setName('');
      // setEmail('');
      // setSubject('');
      // setMessage('');
    } catch (error) {
      console.error("Error sending message: ", error);
      toast({
        title: "Something went wrong",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Header */}
      <header className="bg-background">
        <div className="container mx-auto px-4 py-8">
          <Link href="/" className="inline-block">
            <div className="flex items-center gap-2">
              <span className="bg-primary h-8 w-8 rounded-md flex items-center justify-center text-primary-foreground font-bold">AI</span>
              <span className="text-xl font-bold">DocsMind</span>
            </div>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Get in Touch</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Have questions about DocsMind? Need technical support? We're here to help.
          </p>
        </div>

        <div className="grid md:grid-cols-5 gap-8">
          {/* Contact Info Column */}
          <div className="md:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>Reach out to us through these channels</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start space-x-4">
                  <AtSign className="h-5 w-5 mt-0.5 text-primary" />
                  <div>
                    <h3 className="font-medium">Email</h3>
                    <a 
                      href="mailto:ai-backend@neerajpal.dev" 
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      ai-backend@neerajpal.dev
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <MessageSquare className="h-5 w-5 mt-0.5 text-primary" />
                  <div>
                    <h3 className="font-medium">Support</h3>
                    <p className="text-muted-foreground">
                      For technical issues, please include your account details.
                    </p>
                  </div>
                </div>

                <hr className="my-4" />
                
                <h3 className="font-medium mb-3">Connect with us</h3>
                <div className="flex space-x-4">
                  <a 
                    href="https://github.com/neerajap-01" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
                  >
                    <Github className="h-5 w-5" />
                    <span className="sr-only">GitHub</span>
                  </a>
                  <a 
                    href="https://x.com/NeerajPal945914" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
                  >
                    <X className="h-5 w-5" />
                    <span className="sr-only">Twitter</span>
                  </a>
                  <a 
                    href="https://www.linkedin.com/in/neeraj-palnj/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
                  >
                    <Linkedin className="h-5 w-5" />
                    <span className="sr-only">LinkedIn</span>
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Helpful Resources</CardTitle>
                <CardDescription>Learn more about DocsMind</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link 
                  href="/" // Replace with actual documentation link /docs
                  className="flex items-center justify-between p-3 rounded-md hover:bg-secondary/50 transition-colors"
                >
                  <span>Documentation</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link 
                  href="/"  // Replace with actual FAQ link /faq
                  className="flex items-center justify-between p-3 rounded-md hover:bg-secondary/50 transition-colors"
                >
                  <span>Frequently Asked Questions</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link 
                  href="/" // Replace with actual pricing link /pricing
                  className="flex items-center justify-between p-3 rounded-md hover:bg-secondary/50 transition-colors"
                >
                  <span>Pricing Plans</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link 
                  href="/" // Replace with actual blog link /blog
                  className="flex items-center justify-between p-3 rounded-md hover:bg-secondary/50 transition-colors"
                >
                  <span>Blog & Updates</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form Column */}
          <div className="md:col-span-3">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Send us a Message</CardTitle>
                <CardDescription>We'll get back to you as soon as possible</CardDescription>
              </CardHeader>
              <CardContent>
                {!isSubmitted ? (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          placeholder="Your name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="your.email@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        placeholder="What's this about?"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        placeholder="How can we help you?"
                        rows={6}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="animate-spin mr-2">
                            <Send className="h-4 w-4" />
                          </span>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                ) : (
                  <div className="flex flex-col items-center py-10 text-center">
                    <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/30 mb-4">
                      <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-xl font-medium mb-2">Message Sent!</h3>
                    <p className="text-muted-foreground max-w-md mb-6">
                      Thank you for reaching out. We've received your message and will get back to you as soon as possible.
                    </p>
                    <Button onClick={() => setIsSubmitted(false)}>
                      Send Another Message
                    </Button>
                  </div>
                )}
              </CardContent>
              <CardFooter className="text-sm text-muted-foreground border-t p-4">
                {/* Replace the href to /privacy */}
                Your information is securely processed in accordance with our <Link href="/" className="text-primary hover:underline">Privacy Policy</Link>.
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>

      {/* FAQ Section */}
      <section className="bg-secondary/30 py-16 mt-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>How do I get started with DocsMind?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Simply sign up for an account, upload your documents, and start asking questions. Our AI will analyze your documents and provide relevant answers instantly.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>What file formats are supported?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  DocsMind supports PDF, DOCX, TXT, and markdown files. We're constantly working to add support for additional formats.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Is my data secure?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Absolutely. We use encryption for all documents and don't share your content with third parties. Your documents are only used to answer your specific questions.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>What are the usage limits?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Free accounts can upload up to 3 documents and ask 20 questions per month. For unlimited usage, check out our premium plans on the pricing page.
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center mt-12">
            <Link href="/"> {/* Replace with actual FAQ link */}
              <Button variant="outline">
                View All FAQs
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}