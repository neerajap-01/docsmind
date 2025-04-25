import { env } from "@/lib/config";


const CHATENDPOINT = {
  chatLLM: () => `/chat/docsmind`,
}

const ADMINPANEL = {
  uploadMultipleFiles: () => `/embeddings/multiple/openai`,
}

// const SERVER = `${env.API_ENDPOINT}/api`;
const SERVER = `http://localhost:3000/api`;

export {
  SERVER,
  CHATENDPOINT,
  ADMINPANEL,
}