export const config = {
  api: {
    baseUrl: import.meta.env.VITE_API_URL,
    timeout: 10000,
  },
  app: {
    name: "TestTask",
    version: "1.0.0",
  },
} as const;

export const API_BASE_URL = config.api.baseUrl;
export const API_TIMEOUT = config.api.timeout;
