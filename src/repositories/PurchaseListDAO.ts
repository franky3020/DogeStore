
import mysql from "mysql2";
import Product from "../entity/Product";


export default class PurchaseListDAO {

    private connection: mysql.Pool;

    constructor(connection: mysql.Pool) {
        this.connection = connection;
    }

    insertProductToList(user_id: number, purchase_time: Date, product_id: number): Promise<any> {

        let purchase_time_Date = purchase_time.toISOString().slice(0, 19).replace('T', ' ');

        let sql = "INSERT INTO `PurchaseList`(`user_id`, `product_id`, `purchase_time`)VALUES(?,?,?)";
        return this.connection.promise().query(sql, [user_id, product_id, purchase_time_Date]);
    }

    findUserPurchase(user_id: number): Promise<Product[]> {

        let returnProducts: Product[] = [];

        return new Promise(async (resolve, reject) => {
            let rows: any, fields: any;

            try {
                let sql = "SELECT `Products`.* FROM `PurchaseList` INNER JOIN `Products` \
                           ON `PurchaseList`.`product_id` = `Products`.`id` WHERE `user_id` = ?";
                [rows, fields] = await this.connection.promise().query(sql, [user_id]);
            } catch (err) {
                return reject(err);
            }

            let products_id: number[] = JSON.parse(JSON.stringify(rows));


            if (products_id.length === 0) {
                return resolve([]);
            }

            let jResult = JSON.parse(JSON.stringify(rows));

            for (const product of jResult as Product[]) { // TODO: 有重複問題 insert 時就要檢查了, 且改成傳回 id 就好 保持簡單
                returnProducts.push(new Product(product.id, product.name, product.create_user_id, product.price, product.describe, []));
            }

            return resolve(returnProducts);


        })

    }

    deletePurchaseInList(user_id: number, product_id: number): Promise<any> {
        let sql = "DELETE FROM `PurchaseList` WHERE `user_id` = ? AND `product_id` = ?";
        return this.connection.promise().query(sql, [user_id, product_id]);
    }

}