
import { createNewDatabase, deletesDatabase } from "./db";
import SeedDBFromSQLFile from "./SeedDBFromSQLfile";
import path from "path";

import User from "../entity/User";
import Product from "../entity/Product";
import ProductDAO from "../repositories/ProductDAO";
import MySQLConnectionPool from "../db/MySQLConnectionPool";

import UserService from "../service/UserService";

export async function initAlltables(databaseName: string) {

    await deletesDatabase(databaseName);
    await createNewDatabase(databaseName);

    let connectionPool = MySQLConnectionPool.getPool(databaseName);
    let seedDBFromSQLFile = new SeedDBFromSQLFile(connectionPool);

    await seedDBFromSQLFile.createTable(path.join(__dirname, "./User.sql"));
    await seedDBFromSQLFile.createTable(path.join(__dirname, "./Product.sql"));
    await seedDBFromSQLFile.createTable(path.join(__dirname, "./PurchaseList.sql"));


    // await seedDBFromSQLFile.createTable(path.join(__dirname, "./Order.sql"));
    // await seedDBFromSQLFile.createTable(path.join(__dirname, "./Order_Product_jt.sql"));
}

export async function insertFakeData(databaseName: string) {

    await createNewDatabase(databaseName); // Todo  這裡有錯 已經存在的就不會 create了

    let connectPool = MySQLConnectionPool.getPool(databaseName);

    const user_init = new User(1, "test@gmail.com", "franky", "12345678");
    const user_init_2 = new User(2, "other@gmail.com", "other", "12345678");

    // 一定要先有user 因為外健限制
    let userService = new UserService();
    await userService.addNewUser(user_init.email, user_init.nickname, user_init.password, user_init.id as number);
    await userService.addNewUser(user_init_2.email, user_init_2.nickname, user_init_2.password, user_init_2.id as number);



    const product_init_1 = new Product(1, "product_init_1", 1, 100, "m");
    const product_init_2 = new Product(2, "product_init_2", 1, 200, "m");
    const product_init_3 = new Product(3, "product_init_3", 1, 300, "m");

    let productDAO = new ProductDAO(connectPool);

    await Promise.all([
        productDAO.create(product_init_1),
        productDAO.create(product_init_2),
        productDAO.create(product_init_3),
    ]);
}

if (require.main === module) {
    initAlltables("db_create_from_seed").then(() => {
        MySQLConnectionPool.endPool("db_create_from_seed");
    });
}




