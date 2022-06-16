import mysql from "mysql2";
import MySQLConnectionPool from "../../db/MySQLConnectionPool";
import { resetDB } from "../../db/seed";
import { deletesDatabase } from "../../db/db";


let testDatabaseName = "test_MySQLConnectionPool";
let connectionPool: mysql.Pool;

beforeAll(async () => {
    await resetDB(testDatabaseName);
    connectionPool = MySQLConnectionPool.getPool(testDatabaseName);
});

afterAll(async () => { // 直接刪除整個資料庫就好 Todo 這之後要把它放在所有DAO測試之後
    await deletesDatabase(testDatabaseName);
    MySQLConnectionPool.endPool(testDatabaseName);

});

describe("MySQLConnectionPool", () => {

    test.only("end not exist database name ", () => {

        expect(() => {
            MySQLConnectionPool.endPool("noExist");
        }).toThrow();

    });
});
