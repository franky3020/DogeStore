

import ProductDAO from "../repositories/ProductDAO";
import Product from "../entity/Product";
import mysql from "mysql2";
import MySQLConnectionPool from "../db/MySQLConnectionPool";

import fs from "fs";
import path from "path";

export default class ProductService { // 使用獨體

    connection :mysql.Pool;

    private static instance :ProductService;
    private static readonly SAVE_PRODUCT_IMAGES_PATH = path.join(__dirname, "/../../public/productImg");

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

    // Todo photos?: string[] 應該不需要
    async addProduct(name: string, create_user_id: number, price: number, describe: string, photos?: string[]) {
        let product = new Product(null, name, create_user_id, price, describe, photos);
        let productDAO = new ProductDAO(this.connection);
        await productDAO.create(product);
    }
    
    addProductImg(product_id: number, imageFile: Buffer, fileName: string): Promise<void> {

        return new Promise((resolve, reject)=>{

            let saveDir = path.join(ProductService.SAVE_PRODUCT_IMAGES_PATH, product_id.toString());

            // if err, ignore, you should just unconditionally call mkdir and ignore EEXIST
            fs.mkdir(saveDir, ()=>{
                // Todo 如果使用者亂傳資料, 遇到這裡程式會直接關閉
                let filePath = path.join(saveDir, fileName);
                fs.writeFile(filePath, imageFile,function (error) {

                    if(error) {
                        return reject(error);
                    }

                    return resolve();

                })
            })

        })
        
    }

    getProductImg(product_id: number, fileName: string): Promise<Buffer> {

        return new Promise((resolve, reject)=>{

            let saveDir = path.join(ProductService.SAVE_PRODUCT_IMAGES_PATH, product_id.toString());
            let filePath = path.join(saveDir, fileName);

            

            fs.readFile(filePath, function (error, data) {
                if (error) {
                    return reject(error);
                }
                return resolve(data);
            })

        })


    }

    deleteProductImg(product_id: number, fileName: string): Promise<void> {

        return new Promise((resolve, reject)=>{

            let saveDir = path.join(ProductService.SAVE_PRODUCT_IMAGES_PATH, product_id.toString());
            let filePath = path.join(saveDir, fileName);

            fs.rm(filePath, {force: true} , function (error) {
                if (error) {
                    return reject(error);
                }
                return resolve();
            })

        })


    }


    async findProductById(id: number): Promise<object> {


        let productDAO = new ProductDAO(this.connection);
        let product: Product|null= await productDAO.findById(id);

        let product_json ={};
        if(product) {
            product_json = JSON.parse(JSON.stringify(product));
        }

        return product_json;
    }

    async findAllProduct(): Promise<[]> {
            let productDAO = new ProductDAO(this.connection);
            let products: Product[]= await productDAO.findAll();
        
            let products_json = JSON.parse(JSON.stringify(products));
            return products_json;
    }


}