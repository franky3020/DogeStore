import 'dotenv/config';

import { Router } from 'express';

import { validate, Joi } from "express-validation";
import { Request, Response, NextFunction } from 'express';

import PurchaseListService from "../service/PurchaseListService";
import PurchaseListDAO from "../repositories/PurchaseListDAO";

import { authentication } from "../middleware/jwtAuth";
import isAdminMiddleware from "../middleware/isAdmin";
import ProductService from "../service/ProductService";
import multer from "multer";
import {isAdmin} from "../utils/utils";
import ProductDAO from '../repositories/ProductDAO';
import MySQLConnectionPool from "../db/MySQLConnectionPool";

class PurchaseRouter {

    router = Router();


    private purchaseListService: PurchaseListService;
    private uploadFile: multer.Multer = multer();

    private productService: ProductService;

    constructor() {
        
        let connection = MySQLConnectionPool.getPool(process.env.DB_NAME as string);
        
        let productDAO = new ProductDAO(connection);
        this.productService = new ProductService(productDAO);

        let purchaseListDAO = new PurchaseListDAO(connection);
        this.purchaseListService = new PurchaseListService(purchaseListDAO);


        this.intializeRoutes();
    }

    intializeRoutes() {

        // Get
        this.router.route('/').get(authentication, this.getUserPurchaseList.bind(this));
        this.router.route('/productZipFile/:id').get(authentication, this.isUserhasProductMiddleware.bind(this), this.getProductZipFile.bind(this));
        
        // Post
        this.router.route('/').post(authentication, validate(this.purchaseValidation), this.addPurchasetList.bind(this));
        this.router.route('/productZipFile/:id').post(authentication, isAdminMiddleware ,this.uploadFile.single('uploaded_file'), this.uploadProductZipFile.bind(this));
    }

    private purchaseValidation = {
        body: Joi.object({
            product_id: Joi.number()
                .required()
        }),
    };

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
            let products_id_json = await this.purchaseListService.getUserPurchaseList(user_id);
            return res.send(products_id_json);

        } catch (err) {
            return next(err);
        }
    }

    async getProductZipFile(req: any, res: Response, next: NextFunction) {
        try {

            let product_id: number = Number(req.params.id);
            if (Number.isNaN(product_id)) {
                throw Error("params.id is not number");
            }

            let file = this.productService.getProductZipFilePath(product_id);
            return res.download(file);


        } catch (err) {
            return next(err);
        }
    }

    async isUserhasProductMiddleware(req: any, res: Response, next: NextFunction) {
        try {

            let user_id = req.authUserID;
            if(isAdmin(user_id)) { // Admin have all product
                return next();
            }
            
            let product_id: number = Number(req.params.id);
            if (Number.isNaN(product_id)) {
                throw Error("params.id is not number");
            }
            
        
            let isUserhasProduct = await this.purchaseListService.checkUserhasProduct(user_id, product_id);

            if (isUserhasProduct) {
                return next();
            } else {
                next(new Error("you don't have that product"))
            }
        } catch (err) {
            return next(err);
        }
    }

    async uploadProductZipFile(req: any, res: Response, next: NextFunction) {
        try {

            let product_id: number = Number(req.params.id);
            if (Number.isNaN(product_id)) {
                throw Error("params.id is not number");
            }

            if (typeof req.file === "undefined" ||
                typeof req.file.buffer === "undefined") {

                throw Error("error in upload file");
            }

        
            await this.productService.addProductZipFile(product_id, req.file.buffer);
            return res.status(201).end();
            
        } catch (err) {
            return next(err);
        }
    }

}

export default new PurchaseRouter().router;
