import ProductDAO from "../../repositories/ProductDAO";
import mysql from "mysql2";
import { createNewDatabase, deletesDatabase } from "../../db/db";
import Product from "../../entity/Product";

import ProductsSeed from "../../db/ProductSeed";

let testDatabaseName = "testDatabase";
let productsSeed: ProductsSeed;
let productDAO: ProductDAO;
let connection: mysql.Connection;

beforeAll(async () => {
    await deletesDatabase(testDatabaseName);
    connection = await createNewDatabase(testDatabaseName);

    productsSeed = new ProductsSeed(connection);
    await productsSeed.createTable(); // 創建table, 應該要改名

    productDAO = new ProductDAO(connection);
    let p1: Product = new Product(1, "p_1", 200, "p_d");
    let p2: Product = new Product(2, "p_2", 200, "p_d");
    await productDAO.create(p1);
    await productDAO.create(p2);

});

afterAll(async () => { // 直接刪除整個資料庫就好 Todo 這之後要把它放在所有DAO測試之後
    await deletesDatabase(testDatabaseName);
    connection.end();
});

describe("Find a Product", ()=>{

    test("find p1", async ()=> {

        let p1: Product = await productDAO.findById(1);
        
        expect(1).toEqual(p1.id);
        expect("p_1").toEqual(p1.name);
        expect(200).toEqual(p1.price);
        expect("p_d").toEqual(p1.describe);

    })

    test("findAll", async ()=> {
        let products: Product[] = await productDAO.findAll();
        let expectLength = 2;
        expect(expectLength).toEqual(products.length);
    })

    test("not find", async ()=> {
        await expect(productDAO.findById(0)).rejects.toThrowError();
    })



});


