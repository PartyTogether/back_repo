declare namespace NodeJS {
    interface ProcessEnv {
        BASE_URL: string;
        CLIENT_ID: string;
        CLIENT_SECRET: string;
        REDIRECT_URI: string;

        DB_HOST: string;
        DB_USER: string;
        DB_PASSWORD: string;
        DB_NAME: string;
        DB_PORT: string;
    }
}
