


import ProductService from "../../service/ProductService";
import { createNewDatabase, deletesDatabase } from "../../db/db";
import ProductsSeed from "../../db/ProductSeed";
import mysql from "mysql2";
import ProductDAO from "../../repositories/ProductDAO";
import Product from "../../entity/Product";

const testDatabaseName = "testDB";
let connection: mysql.Connection;
let productDAO: ProductDAO;

beforeAll(async () => {
    await deletesDatabase(testDatabaseName);
    connection = await createNewDatabase(testDatabaseName);

    let productsSeed = new ProductsSeed(connection);
    await productsSeed.createTable();

    productDAO = new ProductDAO(connection);
});

afterAll(async () => { // 直接刪除整個資料庫就好 Todo 這之後要把它放在所有DAO測試之後
    await deletesDatabase(testDatabaseName);
    connection.end();
});


describe("Product service", ()=>{
    test("first", async () => {
        let productService = ProductService.getInstance();
        productService.changeDBTo(testDatabaseName);

        await productService.addProduct("test", 1, 100, "yaya");
        let products: Product[] = await productDAO.findAll();

        expect(products.length).toBe(1);

        if( products.length === 1 ) {
            let a_product = products[0];
            expect(a_product.name).toBe("test");
            expect(a_product.price).toBe(100);
            expect(a_product.describe).toBe("yaya");
        }

        productService.closeDB();


    });
});