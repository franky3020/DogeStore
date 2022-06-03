
import { Router } from 'express';

import { validate, ValidationError, Joi } from "express-validation";

import UserCtrl from '../controller/UserCtrl';

class UserRoutes {

    router = Router();
    UserCtrl = new UserCtrl();

    userLoginValidation = {
        body: Joi.object({
            email: Joi.string()
            .required(),
            password: Joi.string()
            .required()
        }),
      };

    constructor() {
        this.intializeRoutes();
    }

    intializeRoutes() {
        this.router.route('/login').post(validate(this.userLoginValidation), this.UserCtrl.getUserJWT);
    }

}

export default new UserRoutes().router;
