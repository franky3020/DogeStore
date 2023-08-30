import { getDBConfig } from "../../config/config";

test("test config get", () => {
  process.env.NODE_ENV = "production";

  let dbConfig = getDBConfig();

  expect(dbConfig.host).toBe(process.env.DB_HOST);
  expect(dbConfig.user).toBe(process.env.DB_USER);
  expect(dbConfig.password).toBe(process.env.DB_PWD);
  expect(dbConfig.port).toBe(process.env.DB_PORT);

  process.env.NODE_ENV = undefined;
});
