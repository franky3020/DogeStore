// import ProductService from "../../service/ProductService";
// import { deletesDatabase } from "../../db/db";
// import fs from "fs";
// import path from "path";

// import ProductDAO from "../../repositories/ProductDAO";
// import Product from "../../entity/Product";
// import {initAlltables} from "../../db/seed";
// import UserDAO from "../../repositories/UserDAO";
// import User from "../../entity/User";
// import MySQLConnectionPool from "../../db/MySQLConnectionPool";


// const testDatabaseName = "testDatabase_product_service";
// let productDAO: ProductDAO;

// const user_init = new User(1,"u_email", "franky", "ya");
// const product_init_1 = new Product(5, "product_init_1", 1, 100, "product_init_1");
// const productService = new ProductService();

// beforeAll(async () => {
//     await initAlltables(testDatabaseName);
   
//     productService.changeDBTo(testDatabaseName);

//     let connectionPool = MySQLConnectionPool.getPool(testDatabaseName);

//     let userDAO = new UserDAO(connectionPool);
//     await userDAO.create(user_init);  // 一定要先有user 因為外健限制

//     productDAO = new ProductDAO(connectionPool);
//     await productDAO.create(product_init_1);

// });

// afterAll(async () => {
//     await deletesDatabase(testDatabaseName);
//     MySQLConnectionPool.endPool(testDatabaseName);
// });


// describe("Product service", ()=>{
//     test("addProduct", async () => {
     
        
//         const product_1 = new Product(null, "test", 1, 100, "yaya");
//         await productService.addProduct(product_1.name, product_1.create_user_id, product_1.price, product_1.describe);
//         let products: Product[] = await productDAO.findAll();

//         let actual_length = 2;
//         expect(products.length).toBe(actual_length); // 因初始化已經有一個了
//     });

// });

test("empty", () => {
});