import ProductService from "../../service/ProductService";
import { deletesDatabase } from "../../db/db";
import fs from "fs";
import path from "path";

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
const productService = new ProductService();

beforeAll(async () => {
    await initAlltables(testDatabaseName);
   
    productService.changeDBTo(testDatabaseName);

    let connectionPool = MySQLConnectionPool.getPool(testDatabaseName);

    let userDAO = new UserDAO(connectionPool);
    await userDAO.create(user_init);  // 一定要先有user 因為外健限制

    productDAO = new ProductDAO(connectionPool);
    await productDAO.create(product_init_1);

});

afterAll(async () => {
    await deletesDatabase(testDatabaseName);
    MySQLConnectionPool.endPool(testDatabaseName);
});


describe("Product service", ()=>{
    test("addProduct", async () => {
     
        
        const product_1 = new Product(null, "test", 1, 100, "yaya");
        await productService.addProduct(product_1.name, product_1.create_user_id, product_1.price, product_1.describe);
        let products: Product[] = await productDAO.findAll();

        let actual_length = 2;
        expect(products.length).toBe(actual_length); // 因初始化已經有一個了
    });


    test("FindProductById", async () => {
  
        
        let product_json = await productService.findProductById(product_init_1.id as number);

        let actual_json = JSON.parse(JSON.stringify(product_init_1));

        expect(product_json).toEqual(actual_json);
        
    });

    test("Find all product", async () => {

        
        let products_json = await productService.findAllProduct();

        let product_length = products_json.length;
        let actual_length = 2;
        expect(product_length).toEqual(actual_length);

    });

    test("Add a product image", async () => {
    
        let createProductId = 0;
        let testString:string = "test-string";
        let createFileName:string = "test.img";

        try{
            await productService.addProductImg(createProductId, Buffer.from(testString), createFileName);

            let isImgExist = fs.existsSync(path.join(ProductService.SAVE_PRODUCT_IMAGES_PATH, createProductId.toString(), createFileName));
            expect(isImgExist).toBe(true);
            
            await productService.deleteProductImg(createProductId, createFileName);

        } catch(err) {
            expect(true).toBe(false);
        }

    });
    
});