import { GoogleGenerativeAI } from "@google/generative-ai";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

interface DocumentChunk {
  content: string;
  metadata: { source: string };
}

const documentStore: DocumentChunk[] = [];

export async function initializeRAG() {
  documentStore.push({
    content: "Genova is an AI assistant powered by Gemini.",
    metadata: { source: "initial" }
  });
}

export async function addDocumentToRAG(file: Buffer) {
  try {
    const textContent = file.toString('utf-8');
    const loader = new TextLoader(new Blob([textContent]));
    const docs = await loader.load();

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const splitDocs = await splitter.splitDocuments(docs);

    documentStore.push(...splitDocs.map(doc => ({
      content: doc.pageContent,
      metadata: { source: doc.metadata.source || 'unknown' }
    })));

    return "Document processed and added successfully.";
  } catch (error) {
    console.error('Error adding document to RAG:', error);
    return "An error occurred while processing the document.";
  }
}

export async function queryRAG(query: string): Promise<string[]> {
  const keywords = query.toLowerCase().split(/\s+/);
  const relevantDocs = documentStore
    .filter(doc => keywords.some(keyword => doc.content.toLowerCase().includes(keyword)))
    .slice(0, 3)
    .map(doc => doc.content);

  return relevantDocs;
}

export async function generateResponse(query: string, context: string[]) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Context: ${context.join('\n\n')}\n\nQuestion: ${query}\n\nAnswer:`;
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Error generating response:', error);
    throw new Error('Failed to generate response: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
}