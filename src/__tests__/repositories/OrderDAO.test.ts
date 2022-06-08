
import OrderDAO from "../../repositories/OrderDAO";
import Order from "../../entity/Order";

import User from "../../entity/User";
import UserDAO from "../../repositories/UserDAO";

import { deletesDatabase } from "../../db/db";

import {initAlltables} from "../../db/seed";
import MySQLConnectionPool from "../../db/MySQLConnectionPool";


let testDatabaseName = "testDatabase_order";
let userDAO: UserDAO;

let orderDAO: OrderDAO;

const user_init = new User(1,"u_email", "franky", "ya");
const order_init = new Order(1, new Date(), 100, 1);


beforeAll(async () => {
    await initAlltables(testDatabaseName);

    let connectionPool = MySQLConnectionPool.getPool(testDatabaseName);

    userDAO = new UserDAO(connectionPool);
    orderDAO = new OrderDAO(connectionPool);

    await userDAO.create(user_init);

});

afterAll(async () => { // 直接刪除整個資料庫就好 Todo 這之後要把它放在所有DAO測試之後
    await deletesDatabase(testDatabaseName);
    MySQLConnectionPool.endPool(testDatabaseName);

});

describe("Order CRUD", ()=>{

    test("create a order", async ()=> {

        await orderDAO.create(order_init);

    })


});


