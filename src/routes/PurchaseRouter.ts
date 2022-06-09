
import { Router } from 'express';

import { validate, Joi } from "express-validation";
import { Request, Response, NextFunction } from 'express';

import PurchaseListService from "../service/PurchaseListService";

import { authentication } from "../middleware/jwtAuth";
import isAdmin from "../middleware/isAdmin";



class PurchaseRouter {

    router = Router();

    private purchaseListService = new PurchaseListService();

    private purchaseValidation = {
        body: Joi.object({
            product_id: Joi.number()
                .required()
        }),
    };

    constructor() {
        this.intializeRoutes();
    }

    intializeRoutes() {

        // Post
        this.router.route('/').post(authentication, validate(this.purchaseValidation), this.addPurchasetList.bind(this));
       
    }

    async addPurchasetList(req: any, res: Response, next: NextFunction) {
        try {

            
            let user_id = req.authUserID;
            let product_id = req.body.product_id;


            await this.purchaseListService.addProductToPurchaseList(user_id, product_id);
            return res.status(201).end();
        } catch (err) {
            return next(err);
        }
    }

}

export default new PurchaseRouter().router;
