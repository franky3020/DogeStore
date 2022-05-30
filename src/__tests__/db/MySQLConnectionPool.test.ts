import mysql from "mysql2";
import MySQLConnectionPool from "../../db/MySQLConnectionPool";
import {initAlltables} from "../../db/seed";
import { deletesDatabase } from "../../db/db";
import UserDAO from "../../repositories/UserDAO";
import User from "../../entity/User";


let testDatabaseName = "test_MySQLConnectionPool";
let connection: mysql.Connection;
let connectionPool: mysql.Pool;

beforeAll(async () => {
    connection = await initAlltables(testDatabaseName);
    connectionPool = MySQLConnectionPool.getPool(testDatabaseName);

    let userDAO = new UserDAO(connectionPool);

    const user_init = new User(1, "test", "test", "test");
    await userDAO.create(user_init);

});

afterAll(async () => { // 直接刪除整個資料庫就好 Todo 這之後要把它放在所有DAO測試之後
    await deletesDatabase(testDatabaseName);
    connection.end();
    MySQLConnectionPool.endAllPool();
});

describe("MySQLConnectionPool", ()=>{

    test("query", async ()=> {
        
        connectionPool.query("SELECT * FROM User", function(err, rows, fields) {
            // Connection is automatically released when query resolves
            console.log(rows);
        })

    });
});
