import mysql from "mysql2";
import MySQLConnectionPool from "../../db/MySQLConnectionPool";
import { initAlltables } from "../../db/seed";
import { deletesDatabase } from "../../db/db";
import UserDAO from "../../repositories/UserDAO";
import User from "../../entity/User";


let testDatabaseName = "test_MySQLConnectionPool";
let connectionPool: mysql.Pool;

beforeAll(async () => {
    await initAlltables(testDatabaseName);
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
