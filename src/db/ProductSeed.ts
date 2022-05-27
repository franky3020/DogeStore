
// import { connection } from "./db";
import Product from "../entity/Product";
import mysql from "mysql2";


export default class ProductsSeed {

    connection: mysql.Connection;
    
    constructor(connection: mysql.Connection) {
        this.connection = connection;
    }

    createTable() :Promise<void> {
        let connection = this.connection;

        return new Promise<void>((resolve) => {

            connection.connect(function (err) {

                if (err) throw err;
        
                var sql = "CREATE TABLE IF NOT EXISTS `Products` \
                            (`id` INT NOT NULL AUTO_INCREMENT, \
                            `name` VARCHAR(255),  \
                            `price` INT, `describe` TEXT, PRIMARY KEY ( `id` ))";
                
                connection.query(sql, function (err, result) {
                    if (err) throw err;
                    return resolve(result as any);
                });
             
            });

        });

    }

    dropTable(): Promise<void> {
        let connection = this.connection;
        
        return new Promise( (resolve) => {
            connection.connect(function (err) {

                if (err) throw err;
        
                var sql = "DROP TABLE IF EXISTS `Products`";
                connection.query(sql, function (err, result) {
                    if (err) throw err;
                    return resolve(result as any);
                });
            });
        })
    }

}





