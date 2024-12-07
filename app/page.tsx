import ChatInterface from "@/components/chat-interface";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-10">
      <h1 className="text-3xl font-semibold mb-6 text-foreground"><span className="font-normal">Chat with</span> Genova</h1>
      <ChatInterface />
    </main>
  );
}