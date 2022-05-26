
import { connection } from "./db";
import Product from "../entity/Product";


export default class ProductsSeed {

    static create() :Promise<void> {

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

    static drop(): Promise<void> {
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

    // static addSomeProduct(n: number): Promise<void> {
    //     return new Promise( (resolve) => {
    //         connection.connect(function (err) {

    //             if (err) throw err;
        
    //             var sql = "INSERT INTO `database`.`Products`\
    //             (\
    //             `name`,\
    //             `price`,\
    //             `describe`,\
    //             `photos`)\
    //             VALUES\
    //             (\
    //             ?,\
    //             ?,\
    //             ?,\
    //             ?)";

    //             const product = new Product("test", 100, "test_m");

    //             for( let i = 0 ; i < n ; i++) { // 如何非同步執行 但知道所有都執行完 才呼叫resolve?
    //                 connection.query(sql, [product.name, product.price, product.describe, 0], function (err, result) {
    //                     if (err) throw err;
    //                 });
    //             }
    //         });
    //     })
    // }

    static addAProduct(): Promise<void> {
        return new Promise( (resolve) => {
            connection.connect(function (err) {

                if (err) throw err;
        
                var sql = "INSERT INTO `database`.`Products`\
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





