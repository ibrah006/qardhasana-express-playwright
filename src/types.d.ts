declare namespace NodeJS {
    interface ProcessEnv {
      IS_PRODUCTION: string;
      PORT: string;
      DB_HOST_DEV: string;
      DB_HOST_PRODUCTION: string;
      DB_USER: string;
      DB_PASSWORD: string;
      DB_NAME: string;
      DB_PORT: string;
      DB_URL: string;
      JWT_SECRET: string;
    }
  }