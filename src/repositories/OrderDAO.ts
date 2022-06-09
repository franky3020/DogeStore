
import mysql from "mysql2";
import Order from "../entity/Order";

export default class OrderDAO {

    private connection: mysql.Pool;

    constructor(connection: mysql.Pool) {
        this.connection = connection;
    }

    async create(order: Order, ...products_id: number[]): Promise<any> {
        let connection = this.connection;

        let create_time_DataTime = order.create_time.toISOString().slice(0, 19).replace('T', ' ');


        let sql = "INSERT INTO `Order`(`uuid`, `user_id`, `create_time`, `total_money`)VALUES(?,?,?,?)";
        await connection.promise().query(sql, [order.uuid, order.user_id, create_time_DataTime, order.total_money]);

        let allInsertPromise = [];
        for (let id of products_id) {
            allInsertPromise.push(this.insertProductToOrder(order.uuid, id));
        }

        await Promise.all(allInsertPromise);
    }

    insertProductToOrder(order_uuid: string, product_id: number): Promise<any> {
        let sql = "INSERT INTO `Order_Product_jt`(`order_uuid`, `product_id`)VALUES(?,?)";
        return this.connection.promise().query(sql, [order_uuid, product_id]);
    }

    findOrderBy_uuid(order_uuid: string): Promise<Order|null> {


        return new Promise(async (resolve, reject) => {
            let rows: any, fields: any;

            try {
                let sql = "SELECT * FROM `Order`WHERE `uuid` = ?";
                [rows, fields] = await this.connection.promise().query(sql, [order_uuid]);
            } catch(err) {
                return reject(err);
            }

            let orders: Order[] = JSON.parse(JSON.stringify(rows));
            
            if (orders.length === 0) {
                return resolve(null);
            }
            
            let order = orders[0];
            
            return resolve(new Order(order.uuid, order.user_id, new Date(order.create_time), order.total_money));

        })

    }

}