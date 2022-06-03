


import ProductService from "../../service/ProductService";
import { deletesDatabase } from "../../db/db";

import mysql from "mysql2";
import ProductDAO from "../../repositories/ProductDAO";
import Product from "../../entity/Product";
import {initAlltables} from "../../db/seed";
import UserDAO from "../../repositories/UserDAO";
import User from "../../entity/User";
import MySQLConnectionPool from "../../db/MySQLConnectionPool";


const testDatabaseName = "testDatabase_product_service";
let productDAO: ProductDAO;

const user_init = new User(1,"u_email", "franky", "ya");
const product_init_1 = new Product(5, "product_init_1", 1, 100, "product_init_1");

beforeAll(async () => {
    await initAlltables(testDatabaseName);
    let productService = ProductService.getInstance();
    productService.changeDBTo(testDatabaseName);

    let connectionPool = MySQLConnectionPool.getPool(testDatabaseName);

    let userDAO = new UserDAO(connectionPool);
    await userDAO.create(user_init);  // 一定要先有user 因為外健限制

    productDAO = new ProductDAO(connectionPool);
    await productDAO.create(product_init_1);

});

afterAll(async () => { // 直接刪除整個資料庫就好 Todo 這之後要把它放在所有DAO測試之後
    await deletesDatabase(testDatabaseName);
    MySQLConnectionPool.endPool(testDatabaseName);
});


describe("Product service", ()=>{
    test("addProduct", async () => {
        let productService = ProductService.getInstance();
        
        const product_1 = new Product(null, "test", 1, 100, "yaya");
        await productService.addProduct(product_1.name, product_1.create_user_id, product_1.price, product_1.describe);
        let products: Product[] = await productDAO.findAll();

        let actual_length = 2;
        expect(products.length).toBe(actual_length); // 因初始化已經有一個了
    });


    test("is Singleton", ()=>{
        let productService = ProductService.getInstance();
        let productService2 = ProductService.getInstance();

        expect(Object.is(productService, productService2)).toBe(true)
    });


    test("findProductById", async () => {
        let productService = ProductService.getInstance();
        
        let product_json = await productService.findProductById(product_init_1.id as number);

        let actual_json = JSON.parse(JSON.stringify(product_init_1));

        expect(product_json).toEqual(actual_json);
        
    });

    test("findProductById", async () => {
        let productService = ProductService.getInstance();
        
        let products_json = await productService.findAllProduct();

        let product_length = products_json.length;
        let actual_length = 2;
        expect(product_length).toEqual(actual_length);

    });

    test("add Product image", async () => {
        let productService = ProductService.getInstance();
        
        let createProductId = 0;
        let testString:string = "test-string";
        let createFileName:string = "test.img";


        try{
            await productService.addProductImg(createProductId, Buffer.from(testString), createFileName);
            let imgBuffer= await productService.getProductImg(createProductId, createFileName);

            expect(imgBuffer.toString()).toBe(testString);
            await productService.deleteProductImg(createProductId, createFileName);

        } catch(err) {
            expect(true).toBe(false);
        }
        

    });
    
});