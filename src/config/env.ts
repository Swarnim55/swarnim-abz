// Default API base URL as fallback
const DEFAULT_API_BASE_URL =
  "https://frontend-test-assignment-api.abz.agency/api/v1";

export const config = {
  api: {
    baseUrl: import.meta.env.VITE_API_URL || DEFAULT_API_BASE_URL,
    timeout: 10000,
  },
  app: {
    name: "TestTask",
    version: "1.0.0",
  },
} as const;

export const API_BASE_URL = config.api.baseUrl;
export const API_TIMEOUT = config.api.timeout;
