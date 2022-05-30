
import mysql from "mysql2";
import fs from "fs";

export default class SeedDBFromSQLFile {

    connection: mysql.Pool;
    
    constructor(connection: mysql.Pool) {
        this.connection = connection;
    }

    createTable(sqlFilePath: string) :Promise<void> {
        let connection = this.connection;

        return new Promise<void>((resolve) => {

            fs.readFile(sqlFilePath, 'utf8', (err, data) => {
                if (err) {
                    throw new Error("file can't read");
                }
                
                let sql = data;
                
                connection.query(sql, function (err, result) {
                    if (err) throw err;
                    return resolve(result as any);
                });
            });

        });

    }

    dropTable(tableName: string): Promise<void> {
        let connection = this.connection;
        
        return new Promise( (resolve) => {

            var sql = "DROP TABLE IF EXISTS `" + tableName + "`";
            connection.query(sql, function (err, result) {
                if (err) throw err;
                return resolve(result as any);
            });
            
        })
    }

}





