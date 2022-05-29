

import { getNewConnection } from "../db/db";
import ProductDAO from "../repositories/ProductDAO";
import Product from "../entity/Product";
import mysql from "mysql2";


export default class ProductService { // 使用獨體

    connection :mysql.Connection;

    private static instance :ProductService;

    private constructor() {
        this.connection = getNewConnection();
        
    }

    static getInstance() {

        if( typeof ProductService.instance === "undefined" ) {
            ProductService.instance = new ProductService();
        }

        return ProductService.instance;
    }

    changeDBTo(dbName: string) {
        let oldConnection = this.connection;
        
        this.connection = getNewConnection(dbName);

        oldConnection.end();
    }

    closeDB() {// Todo 這要注意 當其中一個 Service 呼叫 則會出錯
        this.connection.end();
    }


    addProduct(name: string, create_user_id: number, price: number, describe: string, photos?: string[]): Promise<void> {
        return new Promise(async (resolve)=>{
            let product = new Product(null, name, create_user_id, price, describe, photos);
            let productDAO = new ProductDAO(this.connection);
            await productDAO.create(product);
            resolve();
        })
        
    }

    findProductById(id: number): Promise<object> {
        return new Promise(async (resolve)=>{
            let productDAO = new ProductDAO(this.connection);
            let product: Product|null= await productDAO.findById(id);

            let product_json ={};
            if(product) {
                product_json = JSON.parse(JSON.stringify(product));
            }

            resolve(product_json);
        })

    }

    findAllProduct(): Promise<[]> {
        return new Promise(async (resolve)=>{
            let productDAO = new ProductDAO(this.connection);
            let products: Product[]= await productDAO.findAll();
           
            let products_json = JSON.parse(JSON.stringify(products));

            resolve(products_json);
        })

    }


}