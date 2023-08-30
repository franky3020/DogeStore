import "dotenv/config";

export const getDBConfig = () => {
  let dbConfig = {
    host: process.env.TEST_DB_HOST,
    user: process.env.TEST_DB_USER,
    password: process.env.TEST_DB_PWD,
    port: process.env.TEST_DB_PORT as unknown as number,
  };

  if (process.env.NODE_ENV === "production") {
    dbConfig.host = process.env.DB_HOST;
    dbConfig.user = process.env.DB_USER;
    dbConfig.password = process.env.DB_PWD;
    dbConfig.port = process.env.DB_PORT as unknown as number;
  }

  return dbConfig;
};

export const ADMIN_ID = 1;
