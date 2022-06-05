
import { Router } from 'express';

import { validate, ValidationError, Joi } from "express-validation";
import { Request, Response, NextFunction } from 'express';

import ProductService from "../service/ProductService";

import { authentication } from "../middleware/jwtAuth";

import multer from "multer";


class ProductRoutes {

    router = Router();

    productValidation = {
        body: Joi.object({
            name: Joi.string()
                .required(),
            create_user_id: Joi.number()
                .required(),
            price: Joi.number()
                .required(),
            describe: Joi.string()
                .required()
        }),
    };

    uploadFile: multer.Multer = multer();

    constructor() {
        this.intializeRoutes();
    }

    intializeRoutes() {
        this.router.route('/:id').get(this.getProductById);
        this.router.route('/').get(this.getAllProduct);
        this.router.route('/').post(authentication, validate(this.productValidation), this.addNewProduct);
        this.router.route('/:id/upload').post(authentication, this.uploadFile.single('uploaded_file'), this.addProductImg);

    }


    //Todo 需消毒輸入參數
    async addNewProduct(req: Request, res: Response, next: NextFunction) {
        let productService = ProductService.getInstance();

        let product_name = req.body.name;
        let create_user_id = req.body.create_user_id;
        let price = req.body.price;
        let describe = req.body.describe;

        try {
            await productService.addProduct(product_name, create_user_id, price, describe);
            res.status(201).end();
        } catch (err) {
            next(err);
        }

    }

    async getProductById(req: Request, res: Response, next: NextFunction) { // 這裡就要去拿到照片
        let productService = ProductService.getInstance();
        try {

            let productId: number = Number(req.params.id);
            if (Number.isNaN(productId)) {
                throw Error("params.id is not number");
            }

            let result = await productService.findProductById(productId);
            res.send(result);
        } catch (err) {
            next(err);
        }
    }

    async getAllProduct(req: Request, res: Response, next: NextFunction) {
        let productService = ProductService.getInstance();
        try {
            let result = await productService.findAllProduct();
            res.send(result);
        } catch (err) {
            next(err);
        }
    }

    // req.file.buffer, req.file.originalname 會從 uploadFile.single('uploaded_file') 提供
    async addProductImg(req: any, res: Response, next: NextFunction) {


        let productService = ProductService.getInstance();
        try {

            let productId: number = Number(req.params.id);
            if (Number.isNaN(productId)) {
                throw Error("params.id is not number");
            }

            await productService.addProductImg(productId, req.file.buffer, req.file.originalname);
            res.status(201).end();
        } catch (err) {
            next(err);
        }

    }




}

export default new ProductRoutes().router;
