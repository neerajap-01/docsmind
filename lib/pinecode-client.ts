import { Pinecone } from '@pinecone-database/pinecone';
import { env } from './config';
import { delay } from './utils';

let pineconeClientInstance: Pinecone | null = null;

async function createIndex(client: Pinecone, indexName: string) {
  try {
    await client.createIndex({
      name: indexName,
      dimension: 1536,
      metric: 'cosine',
      spec: {
        serverless: {
          cloud: 'aws',
          region: 'us-east-1',
        },
        pod: {  
          environment: env.PINECONE_ENVIRONMENT,
          pods: 1,
          podType: 'p1.x1',
        }
      }
    });
  
    console.log(`Waiting for ${env.INDEX_INIT_TIMEOUT} milliseconds for index initialization to complete...`);

    await delay(env.INDEX_INIT_TIMEOUT);
    console.log("Index initialization complete!");
  } catch (error) {
    console.error(`Failed to create index: ${error}`);
    throw new Error(`Failed to create index: ${error}`);
  }
};

async function initPineconeClient(): Promise<Pinecone> {
  try {
    const client = new Pinecone({
      apiKey: env.PINECONE_API_KEY,
    });

    const indexName = env.PINECONE_INDEX_NAME;
    const { indexes } = await client.listIndexes();

    const existingIndexesNames = indexes?.map(index => index.name);

    if(!existingIndexesNames?.includes(indexName)) {
      await createIndex(client, indexName);
    }

    return client;
  } catch (error) {
    console.error(`Failed to initialize Pinecone client: ${error}`);
    throw new Error(`Failed to initialize Pinecone client: ${error}`);
  }
}

export async function getPineconeClient() {
  if(!pineconeClientInstance) {
    pineconeClientInstance = await initPineconeClient();
  }

  return pineconeClientInstance;
}