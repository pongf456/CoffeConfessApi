declare global {
    namespace NodeJS {
      interface ProcessEnv {
        MONGO_DB_PASSWORD : string
        MONGO_DB_USERNAME : string
        APP_PORT: string
        MONGO_DB_PORT : string
        SECRET_APP_KEY:string
      }
    }
  }

  export {}