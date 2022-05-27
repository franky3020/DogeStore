
import Product from "../entity/Product";
import mysql from "mysql2";


export default class ProductDAO {

    connection: mysql.Connection;

    constructor(connection: mysql.Connection) {
        this.connection = connection;
    }


    create(product: Product): Promise<void> {
        let connection = this.connection;

        return new Promise((resolve) => {

            connection.connect(function (err) {

                if (err) throw err;
        
                var sql = "INSERT INTO `Products`\
                (\
                `name`,\
                `price`,\
                `describe`)\
                VALUES\
                (\
                ?,\
                ?,\
                ?)";
    
                connection.query(sql, [product.name, product.price, product.describe], function (err, result) {
                    if (err) throw err;
                    return resolve(result as any);
                });

            });

        })
    }

    update(product: Product): Promise<void> {
        
        let connection = this.connection;

        let sql = "UPDATE `Products` SET `name` = ?, `price` = ?, `describe` = ? WHERE `id` = ?"; // 記得這回傳依舊是list

        return new Promise((resolve, reject) => {
            connection.execute(sql, [ product.name, product.price, product.describe, product.id ], function (err, result) {
                if (err) throw err;
                return resolve();
                
            });
        });

    }

    findById(id: number): Promise<Product | null> {

        let connection = this.connection;

        let sql = "SELECT * FROM `Products` WHERE `id` = ?"; // 記得這回傳依舊是list

        return new Promise((resolve, reject) => {
            connection.execute(sql, [id], function (err, result) {
                if (err) throw err;
    
                let products: Product[] = JSON.parse(JSON.stringify(result));

                if ( products.length === 0 ) {
                    return resolve(null);
                }

                let product = products[0];
                
                return resolve(new Product(product.id, product.name, product.price, product.describe, []));
                
            });
        });

    }

    findAll(): Promise< Product[] > { 

        let sql = "SELECT * FROM `Products`";
        let connection = this.connection;
        let returnProducts: Product[] = [];

        return new Promise((resolve) => {
            connection.query(sql, function (err, result) {
                if (err) throw err;
    
                let jResult= JSON.parse(JSON.stringify(result));
                for(const product of jResult as Product[]) {
                    returnProducts.push(new Product(product.id, product.name, product.price, product.describe, []));
                }
                return resolve(returnProducts);
                
            });
        });

    }

    deleteById(id: number): Promise<void> {

        let connection = this.connection;

        let sql = "DELETE FROM `Products` WHERE `id` = ?"; // 記得這回傳依舊是list

        return new Promise((resolve, reject) => {
            connection.execute(sql, [ id ], function (err, result) {
                if (err) throw err;
                return resolve();
                
            });
        });
    }


}