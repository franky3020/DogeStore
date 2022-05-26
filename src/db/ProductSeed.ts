
// import { connection } from "./db";
import Product from "../entity/Product";
import mysql from "mysql2";


export default class ProductsSeed {

    connection: mysql.Connection;
    
    constructor(connection: mysql.Connection) {
        this.connection = connection;
    }

    create() :Promise<void> {
        let connection = this.connection;

        return new Promise<void>((resolve) => {

            connection.connect(function (err) {

                if (err) throw err;
        
                var sql = "CREATE TABLE IF NOT EXISTS `Products` \
                            (`id` INT NOT NULL AUTO_INCREMENT, \
                            `name` VARCHAR(255),  \
                            `price` INT, `describe` TEXT, `photos` INT, PRIMARY KEY ( `id` ))";
                
                connection.query(sql, function (err, result) {
                    if (err) throw err;
                    console.log("createProductTable");
                    resolve(result as any);

                });
             
            });

        });

    }

    drop(): Promise<void> {
        let connection = this.connection;
        
        return new Promise( (resolve) => {
            connection.connect(function (err) {

                if (err) throw err;
        
                var sql = "DROP TABLE IF EXISTS `Products`";
                connection.query(sql, function (err, result) {
                    if (err) throw err;
        
                    console.log("deleteProductTable");
                    resolve(result as any);
                });
            });
        })
    }

    addAProduct(): Promise<void> {
        let connection = this.connection;

        return new Promise( (resolve) => {
            connection.connect(function (err) {

                if (err) throw err;
        
                var sql = "INSERT INTO `Products`\
                (\
                `name`,\
                `price`,\
                `describe`,\
                `photos`)\
                VALUES\
                (\
                ?,\
                ?,\
                ?,\
                ?)";

                const product = new Product("test", 100, "test_m");

                connection.query(sql, [product.name, product.price, product.describe, 0], function (err, result) {
                    if (err) throw err;
                    resolve(result as any);
                });
            });
        })
    }


}





