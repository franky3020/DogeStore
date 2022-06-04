
import mysql from "mysql2";
import fs from "fs";

export default class SeedDBFromSQLFile {

    connection: mysql.Pool;
    
    constructor(connection: mysql.Pool) {
        this.connection = connection;
    }

    async createTable(sqlFilePath: string) :Promise<any> {
        let connection = this.connection;

        let data = await fs.promises.readFile(sqlFilePath, 'utf8');

        let sql = data;
                
        return connection.promise().query(sql);


    }

    dropTable(tableName: string): Promise<any> {
        let connection = this.connection;

        let sql = "DROP TABLE IF EXISTS `" + tableName + "`";
        return connection.promise().query(sql);
    }

}





