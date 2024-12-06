"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Send } from 'lucide-react';

interface Message {
  role: "user" | "genova";
  content: string;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();
      const genovaMessage: Message = { role: "genova", content: data.response };
      setMessages((prev) => [...prev, genovaMessage]);
    } catch (error) {
      console.error("Error:", error);
      const errorMessage: Message = { role: "genova", content: "Sorry, I couldn't process that request." };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Chat with Genova</CardTitle>
      </CardHeader>
      <CardContent className="h-[440px] overflow-y-auto">
        {messages.map((message, index) => (
          <div key={index} className={`mb-4 ${message.role === "genova" ? "text-blue-600" : "text-green-600"}`}>
            <strong>{message.role === "genova" ? "Genova: " : "You: "}</strong>
            {message.content}
          </div>
        ))}
        {isLoading && <div className="text-gray-500">Genova is typing...</div>}
      </CardContent>
      <CardFooter>
        <form onSubmit={handleSubmit} className="flex w-full gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow"
          />
          <Button type="submit" disabled={isLoading}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}

