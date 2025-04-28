import { env } from "@/lib/config";


const CHATENDPOINT = {
  chatLLM: () => `/chat/docsmind`,
}

const ADMINPANEL = {
  uploadMultipleFiles: () => `/embeddings/multiple/openai`,
}

const AUTHROUTES = {
  register: () => `/auth/register`,
  login: () => `/auth/login`,
  verifyEmail: () => `/auth/verify-email`,
  forgotPassword: () => `/auth/forgot-password`,
  resetPassword: () => `/auth/reset-password`,
  logout: () => `/auth/logout`,
}

const SERVER = `${env.API_ENDPOINT}/api`;

export {
  SERVER,
  CHATENDPOINT,
  ADMINPANEL,
  AUTHROUTES,
}