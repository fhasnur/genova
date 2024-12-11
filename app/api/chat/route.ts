import { NextRequest, NextResponse } from 'next/server';
import { initializeRAG, queryRAG, generateResponse, addDocumentToRAG } from '@/lib/rag';

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not set in the environment variables");
}

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  try {
    await initializeRAG();

    const formData = await req.formData();
    const message = formData.get('message') as string;
    const file = formData.get('file') as File | null;

    if (file) {
      const buffer = await file.arrayBuffer();
      const result = await addDocumentToRAG(Buffer.from(buffer));
      return NextResponse.json({ response: result });
    }

    if (!message) {
      return NextResponse.json({ error: "No message provided" }, { status: 400 });
    }

    const relevantDocs = await queryRAG(message);
    const response = await generateResponse(message, relevantDocs);

    if (!response) {
      throw new Error("Failed to generate response");
    }

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : "An unexpected error occurred"
    }, { status: 500 });
  }
}