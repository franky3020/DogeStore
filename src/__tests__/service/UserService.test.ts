
import ProductService from "../../service/ProductService";
import { deletesDatabase } from "../../db/db";

import mysql from "mysql2";
import ProductDAO from "../../repositories/ProductDAO";
import {initAlltables} from "../../db/seed";
import UserDAO from "../../repositories/UserDAO";
import User from "../../entity/User";
import MySQLConnectionPool from "../../db/MySQLConnectionPool";

import UserService from "../../service/UserService";

const testDatabaseName = "testDatabase_user_service";


const user_init = new User(1,"u_email", "franky", "ya");

let userService: UserService;

beforeAll(async () => {
    await initAlltables(testDatabaseName);
    userService = UserService.getInstance();
    userService.changeDBTo(testDatabaseName);

    let connectionPool = MySQLConnectionPool.getPool(testDatabaseName);

    let userDAO = new UserDAO(connectionPool);
    await userDAO.create(user_init);  // 一定要先有user 因為外健限制

});

afterAll(async () => { // 直接刪除整個資料庫就好 Todo 這之後要把它放在所有DAO測試之後
    await deletesDatabase(testDatabaseName);
    MySQLConnectionPool.endPool(testDatabaseName);
});

describe("Product service", ()=>{

    test("check user password ", async () => {
        let isUserPasswordRight = await userService.checkUserPassword(user_init.email, user_init.password);
        expect(isUserPasswordRight).toBe(true);
        
        let isUserPasswordRight_2 = await userService.checkUserPassword(user_init.email, "error");
        expect(isUserPasswordRight_2).toBe(false);
    });

});
