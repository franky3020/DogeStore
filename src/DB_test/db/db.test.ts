import mysql from "mysql2";
import MySQLConnectionPool from "../../db/MySQLConnectionPool";
import { resetDB } from "../../db/seed";
import {
  createNewDatabase,
  deletesDatabase,
  isDatabaseExist,
} from "../../db/db";

const testDatabaseName = "test_db";
let connectionPool: mysql.Pool;

beforeAll(async () => {
  await resetDB(testDatabaseName);
  connectionPool = MySQLConnectionPool.getPool(testDatabaseName);
});

afterAll(async () => {
  await deletesDatabase(testDatabaseName);
  MySQLConnectionPool.endPool(testDatabaseName);
});

test("test db CRD ", async () => {
  await createNewDatabase(testDatabaseName);
  let isDBExist = await isDatabaseExist(testDatabaseName);
  expect(isDBExist).toBe(true);

  await deletesDatabase(testDatabaseName);
  isDBExist = await isDatabaseExist(testDatabaseName);
  expect(isDBExist).toBe(false);
});
