
import { Router } from 'express';

import { validate, Joi } from "express-validation";

import { Request, Response, NextFunction } from 'express';

import UserService from "../service/UserService";

class UserRoutes {

    router = Router();

    userLoginValidation = {
        body: Joi.object({
            email: Joi.string()
                .required(),
            password: Joi.string()
                .required()
        }),
    };

    userService: UserService = new UserService();;

    constructor() {
        this.intializeRoutes();
    }

    intializeRoutes() {
        this.router.route('/login').post(validate(this.userLoginValidation), this.getUserJWT);
    }


    getUserJWT = async (req: Request, res: Response, next: NextFunction) => {
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


}

export default new UserRoutes().router;
