import { getBaseUrl } from "@/utils/core.utils"

const SERVER_BFF = getBaseUrl();

const ADMINPANELBFF = {
  uploadMultipleFilesBFF: () => `/api/upload`,
}

const AUTHROUTESBFF = {
  register: () => `/api/auth/register`,
  login: () => `/api/auth/login`,
  verifyEmail: () => `/api/auth/verify-email`,
  forgotPassword: () => `/api/auth/forgot-password`,
  resetPassword: () => `/api/auth/reset-password`,
  logout: () => `/api/auth/logout`,
}

export {
  ADMINPANELBFF,
  SERVER_BFF,
  AUTHROUTESBFF
}