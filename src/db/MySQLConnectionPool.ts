
import mysql from "mysql2";


export default class MySQLConnectionPool {

    static existDatabasePool:{ [key: string]: mysql.Pool } = {};

    static getPool(databaseName?: string): mysql.Pool {

        let dbName: string;

        if (databaseName) {
            dbName = databaseName;
        } else {
            dbName = process.env.DB_NAME as string;
        }

        MySQLConnectionPool.newPool(dbName);
        return MySQLConnectionPool.existDatabasePool[dbName];
    }

    static newPool(databaseName: string) {
        
        if(typeof MySQLConnectionPool.existDatabasePool[databaseName] === "undefined") {

            const pool = mysql.createPool({
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_PWD,
                port: process.env.DB_PORT as unknown as number,
                database: databaseName,
                waitForConnections: true,
                connectionLimit: 10,
                queueLimit: 0
            });

            MySQLConnectionPool.existDatabasePool[databaseName] = pool;
        }
    }

    static endAllPool() {
        Object.keys(MySQLConnectionPool.existDatabasePool).forEach((key)=>{
            MySQLConnectionPool.existDatabasePool[key].end();
            delete MySQLConnectionPool.existDatabasePool[key];
        });
    }
}