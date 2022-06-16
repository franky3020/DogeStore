
import mysql from "mysql2";
import 'dotenv/config';
import { getDBConfig } from "../config/config";

export default class MySQLConnectionPool {

    private static existDatabasePool: { [key: string]: mysql.Pool } = {};

    static getPool(databaseName: string): mysql.Pool {
        MySQLConnectionPool.newPool(databaseName);
        return MySQLConnectionPool.existDatabasePool[databaseName];
    }

    static newPool(databaseName: string) {

        if (typeof MySQLConnectionPool.existDatabasePool[databaseName] === "undefined") {

            let dbConfig = getDBConfig();

            const pool = mysql.createPool({
                host: dbConfig.host,
                user: dbConfig.user,
                password: dbConfig.password,
                port: dbConfig.port,
                database: databaseName,
                waitForConnections: true,
                connectionLimit: 5,
                queueLimit: 0,
                timezone: "+00:00",
                multipleStatements: true
            });

            MySQLConnectionPool.existDatabasePool[databaseName] = pool;
        }
    }

    static endAllPool() {
        Object.keys(MySQLConnectionPool.existDatabasePool).forEach((key) => {
            MySQLConnectionPool.existDatabasePool[key].end();
            delete MySQLConnectionPool.existDatabasePool[key];
        });
    }

    static endPool(databaseName: string) {
        // 要檢查有沒有存在 才刪
        if (typeof MySQLConnectionPool.existDatabasePool[databaseName] === "undefined") {
            throw new Error("can't find the database name: '" + databaseName + "'");
        }
        MySQLConnectionPool.existDatabasePool[databaseName].end();
        delete MySQLConnectionPool.existDatabasePool[databaseName];
    }
}