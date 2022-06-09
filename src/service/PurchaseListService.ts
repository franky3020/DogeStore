

import PurchaseListDAO from "../repositories/PurchaseListDAO";
import mysql from "mysql2";

import Product from "../entity/Product";
import MySQLConnectionPool from "../db/MySQLConnectionPool";

export default class PurchaseListService {

    private connection: mysql.Pool;
    private purchaseListDAO: PurchaseListDAO;

    constructor() {
        this.connection = MySQLConnectionPool.getPool();
        this.purchaseListDAO = new PurchaseListDAO(this.connection);

    }


    changeDBTo(dbName: string) {
        this.connection = MySQLConnectionPool.getPool(dbName);
    }
    
    
    async addProductToPurchaseList(user_id: number, product_id: number) {

        let nowUTCDate = new Date();
        await this.purchaseListDAO.create(user_id, nowUTCDate, product_id)
    }




}