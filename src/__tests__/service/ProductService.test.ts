


import ProductService from "../../service/ProductService";
import { deletesDatabase } from "../../db/db";

import mysql from "mysql2";
import ProductDAO from "../../repositories/ProductDAO";
import Product from "../../entity/Product";
import {initAlltables} from "../../db/seed";
import UserDAO from "../../repositories/UserDAO";

const testDatabaseName = "testDatabase_product_service";
let connection: mysql.Connection;
let productDAO: ProductDAO;

beforeAll(async () => {
    connection = await initAlltables(testDatabaseName);
    productDAO = new ProductDAO(connection);
    let userDAO = new UserDAO(connection);
    userDAO.easyCreate(1,"u_email", "franky", "ya");

});

afterAll(async () => { // 直接刪除整個資料庫就好 Todo 這之後要把它放在所有DAO測試之後
    await deletesDatabase(testDatabaseName);
    let productService = ProductService.getInstance();
    productService.closeDB();

    connection.end();
});


describe("Product service", ()=>{
    test("addProduct", async () => {
        let productService = ProductService.getInstance();
        productService.changeDBTo(testDatabaseName);

        
        const product_1 = new Product(null, "test", 1, 100, "yaya");
        await productService.addProduct(product_1.name, product_1.create_user_id, product_1.price, product_1.describe);
        let products: Product[] = await productDAO.findAll();


        expect(products.length).toBe(1);

        if( products.length === 1 ) {
            let a_product = products[0];
            product_1.id = a_product.id; // excluse test id

            expect(a_product).not.toBeNull();
            expect(a_product).toEqual(product_1)
        }
    });


    test("is Singleton", ()=>{
        let productService = ProductService.getInstance();
        let productService2 = ProductService.getInstance();

        expect(Object.is(productService, productService2)).toBe(true)
    });
});