
import { Router } from 'express';

import { validate, Joi } from "express-validation";
import { Request, Response, NextFunction } from 'express';

import ProductService from "../service/ProductService";

import { authentication } from "../middleware/jwtAuth";
import isAdminMiddleware from "../middleware/isAdmin";

import multer from "multer";
import ProductDAO from '../repositories/ProductDAO';
import MySQLConnectionPool from "../db/MySQLConnectionPool";

class ProductRoutes {

    router = Router();

    private productValidation = {
        body: Joi.object({
            name: Joi.string()
                .max(50)
                .required(),
            create_user_id: Joi.number()
                .required(),
            price: Joi.number()
                .required(),
            describe: Joi.string()
                .max(1000)
                .required()
        }),
    };

    private uploadFile: multer.Multer = multer();
    private productService: ProductService;

    constructor() {

        let connection = MySQLConnectionPool.getPool();
        let productDAO = new ProductDAO(connection);
        this.productService = new ProductService(productDAO);


        this.intializeRoutes();
    }

    intializeRoutes() {
        // Get
        this.router.route('/:id').get(this.getProductById.bind(this));
        this.router.route('/').get(this.getAllProduct.bind(this));

        // Post
        this.router.route('/').post(authentication, isAdminMiddleware, validate(this.productValidation), this.addNewProduct.bind(this));
        this.router.route('/:id/upload').post(authentication, isAdminMiddleware, this.uploadFile.single('uploaded_file'), this.addProductImg.bind(this));

        // Delete
        this.router.route('/:id').delete(authentication, isAdminMiddleware, this.deleteProductById.bind(this));
    }


    async addNewProduct(req: any, res: Response, next: NextFunction) {
        try {

            let product_name = req.body.name;
            let create_user_id = req.authUserID;// from authentication middleware
            let price = req.body.price;
            let describe = req.body.describe;


            await this.productService.addProduct(product_name, create_user_id, price, describe);
            return res.status(201).end();
        } catch (err) {
            return next(err);
        }
    }

    async getProductById(req: Request, res: Response, next: NextFunction) { // 這裡就要去拿到照片
        try {

            let productId: number = Number(req.params.id);
            if (Number.isNaN(productId)) {
                throw Error("params.id is not number");
            }

            let result = await this.productService.findProductById(productId);
            return res.send(result);
        } catch (err) {
            return next(err);
        }
    }

    async getAllProduct(req: Request, res: Response, next: NextFunction) {

        try {
            let result = await this.productService.findAllProduct();
            return res.send(result);
        } catch (err) {
            return next(err);
        }
    }

    // req.file.buffer, req.file.originalname 會從 uploadFile.single('uploaded_file') 提供
    async addProductImg(req: any, res: Response, next: NextFunction) {

        try {


            let productId: number = Number(req.params.id);
            if (Number.isNaN(productId)) {
                throw Error("params.id is not number");
            }

            if (typeof req.file === "undefined" ||
                typeof req.file.buffer === "undefined" ||
                typeof req.file.originalname === "undefined") {

                throw Error("error in upload file");
            }

            if (req.file.originalname === "") {
                throw Error("file can't not has name");
            }

            // TODO: 目前只支援png
            await this.productService.addProductImg(productId, req.file.buffer);
            return res.status(201).end();
        } catch (err) {
            return next(err);
        }

    }

    async deleteProductById(req: Request, res: Response, next: NextFunction) {

        try {
            let productId: number = Number(req.params.id);
            if (Number.isNaN(productId)) {
                throw Error("params.id is not number");
            }

            await this.productService.deleteProductById(productId);
            return res.status(200).end();
        } catch (err) {
            return next(err);
        }
    }



}

export default new ProductRoutes().router;
