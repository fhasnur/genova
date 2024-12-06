import { geminiChat } from "@/lib/gemini";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { message } = await req.json();

  try {
    const response = await geminiChat(message);
    return NextResponse.json({ response });
  } catch (error) {
    console.error("Error in chat API:", error);
    return NextResponse.json({ error: "Failed to process the request" }, { status: 500 });
  }
}