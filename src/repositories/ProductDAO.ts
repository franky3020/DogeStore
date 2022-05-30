
import Product from "../entity/Product";
import mysql from "mysql2";


export default class ProductDAO {

    connection: mysql.Pool;

    constructor(connection: mysql.Pool) {
        this.connection = connection;
    }


    create(product: Product): Promise<void> {
        let connection = this.connection;

        return new Promise((resolve, reject) => {

            if( product.id !== null ) {

                let sql = "INSERT INTO `Products`(`id`,`name`,`create_user_id`,`price`, `describe`)VALUES(?,?,?,?,?)";
                connection.query(sql, [product.id, product.name, product.create_user_id, product.price, product.describe], function (err, result) {
                    if (err) return reject(err);
                    return resolve();
                });


            } else {

                let sql = "INSERT INTO `Products`(`name`,create_user_id,`price`,`describe`)VALUES(?,?,?,?)";
                connection.query(sql, [product.name, product.create_user_id, product.price, product.describe], function (err, result) {
                    if (err) return reject(err);
                    return resolve();
                });
            }

        })
    }

    update(product: Product): Promise<void> {
        
        let connection = this.connection;

        let sql = "UPDATE `Products` SET `name` = ?, `create_user_id` = ?,`price` = ?, `describe` = ? WHERE `id` = ?"; // 記得這回傳依舊是list

        return new Promise((resolve, reject) => {
            connection.execute(sql, [ product.name, product.create_user_id, product.price, product.describe, product.id ], function (err, result) {
                if (err) return reject(err);
                return resolve();
                
            });
        });

    }

    findById(id: number): Promise<Product | null> {

        let connection = this.connection;

        let sql = "SELECT * FROM `Products` WHERE `id` = ?"; // 記得這回傳依舊是list

        return new Promise((resolve, reject) => {
            connection.execute(sql, [id], function (err, result) {
                if (err) return reject(err);
    
                let products: Product[] = JSON.parse(JSON.stringify(result));

                if ( products.length === 0 ) {
                    return resolve(null);
                }

                let product = products[0];
                
                return resolve(new Product(product.id, product.name, product.create_user_id, product.price, product.describe, []));
                
            });
        });

    }

    findAll(): Promise< Product[] > { 

        let sql = "SELECT * FROM `Products`";
        let connection = this.connection;
        let returnProducts: Product[] = [];

        return new Promise((resolve, reject) => {
            connection.query(sql, function (err, result) {
                if (err) return reject(err);
    
                let jResult= JSON.parse(JSON.stringify(result));
                for(const product of jResult as Product[]) {
                    returnProducts.push(new Product(product.id, product.name, product.create_user_id, product.price, product.describe, []));
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
                if (err) return reject(err);
                return resolve();
                
            });
        });
    }


}