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

describe("Product CRUD", ()=>{

    test("find p1", async ()=> {

        let p1: Product|null = await productDAO.findById(1);

        if ( p1 !== null ) {
            expect(p1.id).toEqual(1);
            expect(p1.name).toEqual("p_1");
            expect(p1.price).toEqual(200);
            expect(p1.describe).toEqual("p_d");
        }
        

    })

    test("findAll", async ()=> {
        let products: Product[] = await productDAO.findAll();
        let expectLength = 2;
        expect(products.length).toEqual(expectLength);
    })

    test("not find", async ()=> {
        let product = await productDAO.findById(0);
        expect(product).toBeNull();
    })
    
    test("update", async ()=> {

        let p_updata: Product = new Product(1, "updata", 200, "updata");

        await productDAO.update(p_updata);

        let product: Product|null = await productDAO.findById(1);

        if ( p_updata !== null && product !== null) {
            expect(product.id).toBe(p_updata.id);
            expect(product.name).toBe(p_updata.name);
            expect(product.price).toBe(p_updata.price);
            expect(product.describe).toBe(p_updata.describe);
        }

        let p1: Product = new Product(1, "p_1", 200, "p_d");
        await productDAO.update(p1);

    })


    test("Delete", async ()=> {


        await productDAO.deleteById(1);

        let product: Product|null = await productDAO.findById(1);
        expect(product).toBeNull(); 

        let p1: Product = new Product(1, "p_1", 200, "p_d");
        await productDAO.create(p1);

    })
    



});


