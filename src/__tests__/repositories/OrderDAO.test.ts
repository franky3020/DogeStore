
import OrderDAO from "../../repositories/OrderDAO";
import Order from "../../entity/Order";

import User from "../../entity/User";
import UserDAO from "../../repositories/UserDAO";

import { deletesDatabase } from "../../db/db";

import {initAlltables} from "../../db/seed";
import MySQLConnectionPool from "../../db/MySQLConnectionPool";
import ProductDAO from "../../repositories/ProductDAO";

import { v4 as uuidv4 } from 'uuid';
import Product from "../../entity/Product";

let testDatabaseName = "testDatabase_order";

let userDAO: UserDAO;
let orderDAO: OrderDAO;
let productDAO: ProductDAO;

const user_init = new User(1,"u_email", "franky", "ya");

const p1_init: Product = new Product(1, "p_1", 1, 200, "p_d");
const p2_init: Product = new Product(2, "p_2", 1, 200, "p_d");
const p3_init: Product = new Product(3, "p_3", 1, 200, "p_d");

let now_date = new Date();
now_date.setMilliseconds(0); // 因DB 沒存秒數
const order_init = new Order(uuidv4(), 1, now_date, 100);


beforeAll(async () => {
    await initAlltables(testDatabaseName);

    let connectionPool = MySQLConnectionPool.getPool(testDatabaseName);

    userDAO = new UserDAO(connectionPool);
    orderDAO = new OrderDAO(connectionPool);

    await userDAO.create(user_init);

    productDAO = new ProductDAO(connectionPool);

    await productDAO.create(p1_init);
    await productDAO.create(p2_init);
    await productDAO.create(p3_init);

});

afterAll(async () => { // 直接刪除整個資料庫就好 Todo 這之後要把它放在所有DAO測試之後
    // await deletesDatabase(testDatabaseName);
    MySQLConnectionPool.endPool(testDatabaseName);

});

describe("Order CRUD", ()=>{

    test.only("create a order", async ()=> {

        await orderDAO.create(order_init, 1, 2, 3);
        let order = await orderDAO.findOrderBy_uuid(order_init.uuid);

        console.log(order_init.create_time.getTime());
        expect(order).toEqual(order_init);


    })


});


