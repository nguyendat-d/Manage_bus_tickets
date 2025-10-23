declare const __dirname: string;
declare const __filename: string;

declare namespace NodeJS {
  interface ProcessEnv {
    DB_HOST?: string;
    DB_PORT?: string;
    DB_USER?: string;
    DB_PASS?: string;
    DB_NAME?: string;
    PORT?: string;
  }
}
