import { getChunkedDocsFromPDF } from "@/lib/pdf-loader";
import { embedAndStoreDocs } from "@/lib/vector-store";
import { getPineconeClient } from "@/lib/pinecode-client";

(async () => {
  try {
    const pineconeClient = await getPineconeClient();
    console.log("Preparing chunked from PDF file");

    const docs = await getChunkedDocsFromPDF();
    console.log(`Loading ${docs.length} chunks into Pinecone...`);

    await embedAndStoreDocs(pineconeClient, docs);
    console.log("Data embedded and stored in pine-cone index");

  } catch (error) {
    console.error("Init client script failed ", error)
  }
})()