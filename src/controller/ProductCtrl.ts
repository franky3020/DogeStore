import { Request, Response, NextFunction } from 'express';

import ProductService from "../service/ProductService";

export default class ProductCtrl {


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
            let result = await productService.findProductById(Number(req.params.id));
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
}