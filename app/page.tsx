import ChatInterface from "@/components/chat-interface";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-6">
      <h1 className="text-3xl font-semibold text-foreground"><span className="font-normal">Chat with</span> Genova</h1>
      <p className="text-sm text-muted-foreground mb-6 text-center">
        Powered by Gemini and RAG. Upload documents to enhance Genova&apos;s knowledge.
      </p>
      <ChatInterface />
    </main>
  );
}