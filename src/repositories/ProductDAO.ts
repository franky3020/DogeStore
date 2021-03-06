
import Product from "../entity/Product";
import mysql from "mysql2";


export default class ProductDAO {

    private connection: mysql.Pool;

    constructor(connection: mysql.Pool) {
        this.connection = connection;
    }

    create(product: Product): Promise<any> {
        let connection = this.connection;

        if( product.id !== null ) {
            let sql = "INSERT INTO `Products`(`id`,`name`,`create_user_id`,`price`, `describe`)VALUES(?,?,?,?,?)";
            return connection.promise().query(sql, [product.id, product.name, product.create_user_id, product.price, product.describe]);
        } else {
            let sql = "INSERT INTO `Products`(`name`,create_user_id,`price`,`describe`)VALUES(?,?,?,?)";
            return connection.promise().query(sql, [product.name, product.create_user_id, product.price, product.describe]);
        }
    }

    update(product: Product): Promise<any> {
        
        let connection = this.connection;

        let sql = "UPDATE `Products` SET `name` = ?, `create_user_id` = ?,`price` = ?, `describe` = ? WHERE `id` = ?"; // 記得這回傳依舊是list

        return connection.promise().execute(sql, [ product.name, product.create_user_id, product.price, product.describe, product.id ]);

    }

    findById(id: number): Promise<Product | null> {

        let connection = this.connection;

        let sql = "SELECT * FROM `Products` WHERE `id` = ?"; // 記得這回傳依舊是list

        return new Promise(async (resolve, reject) => {
            let rows: any, fields: any;
            try{
                [rows, fields] = await connection.promise().execute(sql, [id]);

            }catch(err) {
                return reject(err);
            }

            let products: Product[] = JSON.parse(JSON.stringify(rows));

            if ( products.length === 0 ) {
                return resolve(null);
            }

            let product = products[0];
            return resolve(new Product(product.id, product.name, product.create_user_id, product.price, product.describe, []));
            
        });

    }

    findAll(): Promise< Product[] > { 

        let sql = "SELECT * FROM `Products`";
        let connection = this.connection;
        let returnProducts: Product[] = [];

        return new Promise(async (resolve, reject) => {
            let rows: any, fields: any;

            try{
                [rows, fields] = await connection.promise().query(sql);
            } catch(err) {
                return reject(err);
            }

            let jResult= JSON.parse(JSON.stringify(rows));
            for(const product of jResult as Product[]) {
                returnProducts.push(new Product(product.id, product.name, product.create_user_id, product.price, product.describe, []));
            }
            return resolve(returnProducts);
        });

    }

    deleteById(id: number): Promise<any> {

        let connection = this.connection;

        let sql = "DELETE FROM `Products` WHERE `id` = ?";
        return connection.promise().execute(sql, [ id ]);
        
    }


}