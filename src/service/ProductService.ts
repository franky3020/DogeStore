

import { getNewConnection } from "../db/db";
import ProductDAO from "../repositories/ProductDAO";
import Product from "../entity/Product";
import mysql from "mysql2";
import MySQLConnectionPool from "../db/MySQLConnectionPool";


export default class ProductService { // 使用獨體

    connection :mysql.Pool;

    private static instance :ProductService;

    private constructor() {
        this.connection = MySQLConnectionPool.getPool();
    }

    static getInstance() {

        if( typeof ProductService.instance === "undefined" ) {
            ProductService.instance = new ProductService();
        }

        return ProductService.instance;
    }

    changeDBTo(dbName: string) {

        this.connection = MySQLConnectionPool.getPool(dbName);
    }

    closeDB() {// Todo 這要注意 當其中一個 Service 呼叫 則會出錯
        // this.connection.end();
    }


    addProduct(name: string, create_user_id: number, price: number, describe: string, photos?: string[]): Promise<void> {
        return new Promise(async (resolve, reject)=>{
            let product = new Product(null, name, create_user_id, price, describe, photos);
            let productDAO = new ProductDAO(this.connection);

            try {
                await productDAO.create(product);
                return resolve();
            } catch(err) {
                return reject(err);
            }


        })
        
    }

    findProductById(id: number): Promise<object> {
        return new Promise(async (resolve, reject)=>{
            let productDAO = new ProductDAO(this.connection);


            try {
                let product: Product|null= await productDAO.findById(id);

                let product_json ={};
                if(product) {
                    product_json = JSON.parse(JSON.stringify(product));
                }

                return resolve(product_json);
            } catch(err) {
                return reject(err);
            }
            
        })

    }

    findAllProduct(): Promise<[]> {
        return new Promise(async (resolve, reject)=>{

            try {
                let productDAO = new ProductDAO(this.connection);
                let products: Product[]= await productDAO.findAll();
            
                let products_json = JSON.parse(JSON.stringify(products));

                return resolve(products_json);
            } catch(err) {
                return reject(err);
            }
            
        })

    }


}