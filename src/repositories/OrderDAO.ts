
import mysql from "mysql2";
import Order from "../entity/Order";

export default class OrderDAO {

    private connection: mysql.Pool;

    constructor(connection: mysql.Pool) {
        this.connection = connection;
    }

    create(order: Order): Promise<any> {
        let connection = this.connection;

        let create_time_DataTime = order.create_time.toISOString().slice(0, 19).replace('T', ' ');
        

        if( typeof order.id !== "undefined" ) {
            let sql = "INSERT INTO `Order`(`id`, `user_id`, `create_time`, `total_money`)VALUES(?,?,?,?)";
            return connection.promise().query(sql, [order.id, order.user_id, create_time_DataTime, order.total_money]);
        } else {
            let sql = "INSERT INTO `Order`(`user_id`, `create_time`, `total_money`)VALUES(?,?,?)";
            return connection.promise().query(sql, [order.user_id, create_time_DataTime, order.total_money]);
        }
    }

}