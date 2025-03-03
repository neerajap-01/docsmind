import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone } from "@pinecone-database/pinecone";
import { env } from "./config";

export async function embedAndStoreDocs(
  client: Pinecone,
  // @ts-expect-error docs type error
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  docs: Document<Record<string, any>>[]
) {
  try {
    const embeddings = new OpenAIEmbeddings(); // LLM API with text model as "text-ada-002"
    const index = client.index(env.PINECONE_INDEX_NAME);

    // Embed and store each document
    await PineconeStore.fromDocuments(docs, embeddings, {
      pineconeIndex: index,
      namespace: env.PINECONE_NAME_SPACE,
      textKey: "text",
    })
  } catch (error) {
    console.error(error);
    throw new Error("Document embedding and storing failed");
  }
}

export async function getVectorStore(client: Pinecone) {
  try {
    const embeddings = new OpenAIEmbeddings(); // LLM API with text model as "text-ada-002"
    const index = client.index(env.PINECONE_INDEX_NAME);

    const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex: index,
      textKey: "text", // metadata key used during retrieving the information from pinecone
      namespace: env.PINECONE_NAME_SPACE,
    });

    return vectorStore;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get vector store");
  }
}