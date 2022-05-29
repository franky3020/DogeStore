
import mysql from "mysql2";
import { createNewDatabase, deletesDatabase } from "./db";
import SeedDBFromSQLFile from "./SeedDBFromSQLfile";
import path from "path";

import User from "../entity/User";
import Product from "../entity/Product";
import UserDAO from "../repositories/UserDAO";
import ProductDAO from "../repositories/ProductDAO";

export function initAlltables(databaseName: string): Promise<mysql.Connection> {

    return new Promise(async (resolve) => {

        await deletesDatabase(databaseName);
        let connection: mysql.Connection = await createNewDatabase(databaseName);
    
        let seedDBFromSQLFile = new SeedDBFromSQLFile(connection)
        await seedDBFromSQLFile.createTable(path.join(__dirname, "./User.sql"));
        await seedDBFromSQLFile.createTable(path.join(__dirname, "./Product.sql"));

        return resolve(connection);

    });
}

export function insertFakeData(databaseName: string): Promise<mysql.Connection> {

    return new Promise(async (resolve) => {

        let connection: mysql.Connection = await createNewDatabase(databaseName);

        const user_init = new User(1,"u_email", "franky", "ya");
        
        let userDAO = new UserDAO(connection);
        await userDAO.create(user_init);  // 一定要先有user 因為外健限制
        
        const product_init_1 = new Product(1, "product_init_1", 1, 100, "m");
        const product_init_2 = new Product(2, "product_init_2", 1, 200, "m");
        const product_init_3 = new Product(3, "product_init_3", 1, 300, "m");

        let productDAO = new ProductDAO(connection);
        Promise.all([
            productDAO.create(product_init_1),
            productDAO.create(product_init_2),
            productDAO.create(product_init_3),
        ])
        

        return resolve(connection);

    });
}

if (require.main === module) {
    initAlltables("db_create_from_seed").then((connection)=>{
        connection.end();// 有end, 程式才會正常結束 重要
        console.log("over")
    });
} 




