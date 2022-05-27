

import { getNewConnection } from "../db/db";
import ProductDAO from "../repositories/ProductDAO";
import Product from "../entity/Product";
import mysql from "mysql2";


export default class ProductService { // 使用獨體

    connection :mysql.Connection;

    static notUseInstance :boolean = true;

    constructor() {

        if(ProductService.notUseInstance) {
            throw new Error("ProductService need to use getInstance()");
        }

        this.connection = getNewConnection();
        
    }

    static getInstance() {
        ProductService.notUseInstance = false;

        return new ProductService();
    }

    changeDBTo(dbName: string) {
        let oldConnection = this.connection;
        
        this.connection = getNewConnection(dbName);

        oldConnection.end();
    }

    closeDB() {// Todo 這要注意 當其中一個 Service 呼叫 則會出錯
        this.connection.end();
    }


    async addProduct(name: string, price: number, describe: string, photos?: string[]) {
        let product = new Product(null, name, price, describe, photos);
        let productDAO = new ProductDAO(this.connection);
        await productDAO.create(product);
    }


}