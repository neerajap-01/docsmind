import { env } from "@/lib/config";


const SERVER = `${env.API_ENDPOINT}/api`;

const CHATENPOINT = {
  chatLLM: () => `/chat/docsmind`,
}

export {
  SERVER,
  CHATENPOINT,
}