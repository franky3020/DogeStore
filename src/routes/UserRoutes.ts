
import { Router } from 'express';

import { validate, Joi } from "express-validation";
import mysql from "mysql2";

import { Request, Response, NextFunction } from 'express';
import MySQLConnectionPool from "../db/MySQLConnectionPool";
import UserDAO from "../repositories/UserDAO";

import UserService from "../service/UserService";

class UserRoutes {

    router = Router();

    private userLoginValidation = {
        body: Joi.object({
            email: Joi.string()
                .email()
                .required(),
            password: Joi.string()
                .min(8)
                .max(20)
                .required()
        }),
    };

    private userRegisterValidation = {
        body: Joi.object({
            email: Joi.string()
                .email()
                .required(),
            password: Joi.string()
                .min(8)
                .max(20)
                .required(),
            nickname: Joi.string()
                .min(1)
                .max(20)
                .required()
        }),
    };

    private connection: mysql.Pool;
    private userDAO: UserDAO;
    

    private userService: UserService;

    constructor() {

        this.connection = MySQLConnectionPool.getPool();
        this.userDAO = new UserDAO(this.connection);
        this.userService = new UserService(this.userDAO);

        this.intializeRoutes();
    }

    intializeRoutes() {
        // 需要使用 bind 在 呼叫同類別的方法
        this.router.route('/login').post(validate(this.userLoginValidation), this.getUserJWT.bind(this));
        this.router.route('/register').post(validate(this.userRegisterValidation), this.userRegister.bind(this));
    }


    async getUserJWT(req: Request, res: Response, next: NextFunction) {
        try {
            let email = req.body.email;
            let password = req.body.password;

            // 這裡為了讓商業邏輯封裝在 service中 所以不能是先做判斷 在拿去JWT, 現在這樣才是對的
            let jwt = await this.userService.getUserJWT(email, password);

            if (jwt) {

                let jwt_json = { "token": jwt };
                res.send(jwt_json);

            } else {
                res.status(401).end();
            }

        } catch (err) {
            next(err);
        }
    }



    async userRegister(req: Request, res: Response, next: NextFunction) {
        try {
            let email = req.body.email;
            let password = req.body.password;
            let nickname = req.body.nickname;

            await this.userService.addNewUser(email, nickname, password);

            return res.status(201).end();

        } catch (err) {
            next(err);
        }
    }


}

export default new UserRoutes().router;
