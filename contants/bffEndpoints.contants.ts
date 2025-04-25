import { getBaseUrl } from "@/utils/core.utils"

const SERVER_BFF = getBaseUrl();

const ADMINPANELBFF = {
  uploadMultipleFilesBFF: () => `/api/upload`,
}

export {
  ADMINPANELBFF,
  SERVER_BFF
}