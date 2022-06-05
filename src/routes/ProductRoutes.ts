
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
    productService: ProductService;

    constructor() {
        this.productService = new ProductService();
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

        try {

            let product_name = req.body.name;
            let create_user_id = req.body.create_user_id;
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
                throw Error("file can't not name");
            }


            await this.productService.addProductImg(productId, req.file.buffer, req.file.originalname);
            return res.status(201).end();
        } catch (err) {
            return next(err);
        }

    }




}

export default new ProductRoutes().router;
