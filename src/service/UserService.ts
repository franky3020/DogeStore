

import mysql from "mysql2";
import MySQLConnectionPool from "../db/MySQLConnectionPool";
import UserDAO from "../repositories/UserDAO";

import User from "../entity/User";
import 'dotenv/config';

const jwt = require("jsonwebtoken");

export default class UserService { // 使用獨體

    connection :mysql.Pool;

    private static instance :UserService;

    private constructor() {
        this.connection = MySQLConnectionPool.getPool();
    }

    static getInstance() {

        if( typeof UserService.instance === "undefined" ) {
            UserService.instance = new UserService();
        }

        return UserService.instance;
    }

    changeDBTo(dbName: string) {

        this.connection = MySQLConnectionPool.getPool(dbName);
    }

    // Todo JWT 的簽名 應該獨立出來, 因為簽名的欄位 要放在一起管裡, 不能每次都來這裡查看
    // 要有服務專門簽使用者 與 驗證使用者
    async getUserJWT(email: string, password: string): Promise<string|null> {

        let isLogin = await this.checkUserPassword(email, password);
        if(isLogin) {
            let userDAO = new UserDAO(this.connection);
            let user: User|null= await userDAO.findByEmail(email);

            if(user) {
                let id = user.id;
                let nickname = user.nickname;
                const token = jwt.sign({ id, email, nickname }, process.env.JWT_PRIVATE_KEY);
                return token;
            }

        }
        return null;

    }

    async checkUserPassword(email: string, password: string): Promise<boolean> {


        let userDAO = new UserDAO(this.connection);
        let user: User|null= await userDAO.findByEmail(email);

        if(user && user.password === password) {
            return true;
        }
        return false;

    }



    // async addProduct(name: string, create_user_id: number, price: number, describe: string, photos?: string[]) {
    //     let product = new Product(null, name, create_user_id, price, describe, photos);
    //     let productDAO = new ProductDAO(this.connection);
    //     await productDAO.create(product);
    // }

    

    // async findAllProduct(): Promise<[]> {
    //         let productDAO = new ProductDAO(this.connection);
    //         let products: Product[]= await productDAO.findAll();
        
    //         let products_json = JSON.parse(JSON.stringify(products));
    //         return products_json;
    // }


}