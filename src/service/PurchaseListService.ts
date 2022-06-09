

import PurchaseListDAO from "../repositories/PurchaseListDAO";
import mysql from "mysql2";
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
        await this.purchaseListDAO.insertProductToList(user_id, nowUTCDate, product_id)
    }

    async getUserPurchaseList(user_id: number): Promise<object> {

        let products = await this.purchaseListDAO.findUserPurchase(user_id);

        let products_json = JSON.parse(JSON.stringify(products));

        return products_json;

    }




}