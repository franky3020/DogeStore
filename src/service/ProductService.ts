

import ProductDAO from "../repositories/ProductDAO";
import Product from "../entity/Product";
import mysql from "mysql2";
import MySQLConnectionPool from "../db/MySQLConnectionPool";

import fs from "fs";
import path from "path";

export default class ProductService {

    private connection: mysql.Pool;

    private static readonly SAVE_PRODUCT_IMAGES_PATH = path.join(__dirname, "/../../public/productImg");
    private static readonly SAVE_PRODUCT_ZIP_FILE_PATH = path.join(__dirname, "/../../product_zip");
    private static readonly PRODUCT_ZIP_FILE_NAME = "product.zip";

    constructor() {
        this.connection = MySQLConnectionPool.getPool();
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

    async addProductImg(product_id: number, imageFile: Buffer, fileName: string): Promise<void> {

        let saveDir = path.join(ProductService.SAVE_PRODUCT_IMAGES_PATH, product_id.toString());
            
        await fs.promises.mkdir(saveDir).catch((err)=>{
            // do Nothing
        }); // 故意忽略錯誤


        let filePath = path.join(saveDir, fileName);
        await fs.promises.writeFile(filePath, imageFile);

    }

    // TODO: 目前沒地方用到
    getProductImg(product_id: number, fileName: string): Promise<Buffer> {

        return new Promise(async (resolve, reject) => {

            let saveDir = path.join(ProductService.SAVE_PRODUCT_IMAGES_PATH, product_id.toString());
            let filePath = path.join(saveDir, fileName);

            try {
                let data = await fs.promises.readFile(filePath);
                return resolve(data);
            } catch(err) {
                reject(err);
            }

        })


    }

    getProductZipFilePath(product_id: number): string {
        let fileName = ProductService.PRODUCT_ZIP_FILE_NAME;
        let productZipFilePath = path.join(ProductService.SAVE_PRODUCT_ZIP_FILE_PATH, product_id.toString(), fileName);
        return productZipFilePath;

    }

    // TODO: 目前沒地方用到
    deleteProductImg(product_id: number, fileName: string): Promise<any> {

        let saveDir = path.join(ProductService.SAVE_PRODUCT_IMAGES_PATH, product_id.toString());
        let filePath = path.join(saveDir, fileName);

        return fs.promises.rm(filePath, { force: true });
    }


    async findProductById(id: number): Promise<object> {


        let productDAO = new ProductDAO(this.connection);
        let product: Product | null = await productDAO.findById(id);

        
        let product_json = {};
        if (product) {
            product_json = JSON.parse(JSON.stringify(product));
        }

        return product_json;
    }

    async findAllProduct(): Promise<[]> {
        let productDAO = new ProductDAO(this.connection);
        let products: Product[] = await productDAO.findAll();

        let products_json = JSON.parse(JSON.stringify(products));
        return products_json;
    }

    async deleteProductById(id: number): Promise<void> {
        let productDAO = new ProductDAO(this.connection);
        await productDAO.deleteById(id);
    }


}