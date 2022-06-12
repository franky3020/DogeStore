import ProductService from "../../service/ProductService";
import fs from "fs";
import path from "path";

import ProductDAO from "../../repositories/ProductDAO";
import Product from "../../entity/Product";


const product_init_1 = new Product(5, "product_init_1", 1, 100, "product_init_1");
const productService = new ProductService();



beforeAll(async () => {
    

});

afterAll(async () => {
  
});

describe("Product service", ()=>{


    test("FindProductById", async () => {
  
        // ProductDAO.
        
        // let product_json = await productService.findProductById(product_init_1.id as number);

        // let actual_json = JSON.parse(JSON.stringify(product_init_1));

        // expect(product_json).toEqual(actual_json);
        
    });

   
    
});