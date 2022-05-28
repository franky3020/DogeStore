
import mysql from "mysql2";
import { createNewDatabase, deletesDatabase } from "./db";
import SeedDBFromSQLFile from "./SeedDBFromSQLfile";
import path from "path";

export function initAlltables(databaseName: string): Promise<mysql.Connection> {

    return new Promise(async (resolve) => {

        await deletesDatabase(databaseName);
        let connection: mysql.Connection = await createNewDatabase(databaseName);
    
        let seedDBFromSQLFile = new SeedDBFromSQLFile(connection)
        await seedDBFromSQLFile.createTable(path.join(__dirname, "./Product.sql"));
        await seedDBFromSQLFile.createTable(path.join(__dirname, "./User.sql"));

        return resolve(connection);

    });
}




