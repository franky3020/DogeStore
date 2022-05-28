
import mysql from "mysql2";
import { createNewDatabase, deletesDatabase } from "./db";
import SeedDBFromSQLFile from "./SeedDBFromSQLfile";
import path from "path";

export function initAlltables(databaseName: string): Promise<mysql.Connection> {

    return new Promise(async (resolve) => {

        await deletesDatabase(databaseName);
        let connection: mysql.Connection = await createNewDatabase(databaseName);
    
        let seedDBFromSQLFile = new SeedDBFromSQLFile(connection)
        await seedDBFromSQLFile.createTable(path.join(__dirname, "./User.sql"));
        await seedDBFromSQLFile.createTable(path.join(__dirname, "./Product.sql"));

        return resolve(connection);

    });
}

if (require.main === module) {
    initAlltables("db_create_from_seed").then((connection)=>{
        connection.end();// 有end, 程式才會正常結束 重要
        console.log("over")
    });
} 




