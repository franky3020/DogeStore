import "dotenv/config";

import { Router } from "express";

import { validate, Joi } from "express-validation";
import mysql from "mysql2";

import { Request, Response, NextFunction } from "express";
import MySQLConnectionPool from "../db/MySQLConnectionPool";
import UserDAO from "../repositories/UserDAO";

import UserService from "../service/UserService";

class UserRoutes {
  router = Router();

  private connection: mysql.Pool;
  private userDAO: UserDAO;

  private userService: UserService;

  constructor() {
    this.connection = MySQLConnectionPool.getPool(
      process.env.DB_NAME as string,
    );
    this.userDAO = new UserDAO(this.connection);
    this.userService = new UserService(this.userDAO);

    this.intializeRoutes();
  }

  intializeRoutes() {
    // 需要使用 bind 在 呼叫同類別的方法
    this.router
      .route("/login")
      .post(validate(this.userLoginValidation), this.getUserJWT.bind(this));
    this.router
      .route("/register")
      .post(
        validate(this.userRegisterValidation),
        this.userRegister.bind(this),
      );
    this.router.route("/register").post(this.userName.bind(this));
  }

  private userLoginValidation = {
    body: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(8).max(20).required(),
    }),
  };

  private userRegisterValidation = {
    body: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(8).max(20).required(),
      nickname: Joi.string().min(1).max(20).required(),
    }),
  };

  async getUserJWT(req: Request, res: Response, next: NextFunction) {
    try {
      let email = req.body.email;
      let password = req.body.password;

      // 這裡為了讓商業邏輯封裝在 service中 所以不能是先做判斷 在拿去JWT, 現在這樣才是對的
      let jwt = await this.userService.getUserJWT(email, password);

      if (jwt) {
        let jwt_json = { token: jwt };
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

  async userName(req: Request, res: Response, next: NextFunction) {
    try {
      let userId: number = Number(req.params.id);
      let userName = await this.userService.getUserNameById(userId);

      if (userName === null) {
        return res.status(404).end();
      }

      let get_user_id_json = {
        userName: userName,
      };

      return res.send(get_user_id_json);
    } catch (err) {
      next(err);
    }
  }
}

export default new UserRoutes().router;
