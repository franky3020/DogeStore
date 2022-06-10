
import { Router } from 'express';

import { validate, Joi } from "express-validation";
import { Request, Response, NextFunction } from 'express';

import PurchaseListService from "../service/PurchaseListService";

import { authentication } from "../middleware/jwtAuth";
import isAdmin from "../middleware/isAdmin";
import ProductService from "../service/ProductService";



class PurchaseRouter {

    router = Router();

    private purchaseListService = new PurchaseListService();

    private purchaseValidation = {
        body: Joi.object({
            product_id: Joi.number()
                .required()
        }),
    };

    private productService = new ProductService();

    constructor() {
        this.intializeRoutes();
    }

    intializeRoutes() {

        // Get
        this.router.route('/').get(authentication, this.getUserPurchaseList.bind(this));
        this.router.route('/productZipFile/:id').get(authentication, this.getProductZipFile.bind(this));
        
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

    async getUserPurchaseList(req: any, res: Response, next: NextFunction) {
        try {

            let user_id = req.authUserID;

            let products_json = await this.purchaseListService.getUserPurchaseList(user_id);
            return res.send(products_json);
        } catch (err) {
            return next(err);
        }
    }

    async getProductZipFile(req: any, res: Response, next: NextFunction) {
        try {

            let user_id = req.authUserID;
            
            let product_id: number = Number(req.params.id);
            if (Number.isNaN(product_id)) {
                throw Error("params.id is not number");
            }
        
            let isUserhasProduct = await this.purchaseListService.checkUserhasProduct(user_id, product_id);

            if(isUserhasProduct) {
                let file = this.productService.getProductZipFilePath(product_id);
                return res.download(file);
            } else {
                return res.status(401).end();
            }


        } catch (err) {
            return next(err);
        }
    }

}

export default new PurchaseRouter().router;
