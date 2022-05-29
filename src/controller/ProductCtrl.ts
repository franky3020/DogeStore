import { Request, Response, NextFunction } from 'express';

import ProductService from "../service/ProductService";

export default class ProductCtrl {


    static async addNewProduct(req: Request, res: Response, next: NextFunction) {
        let productService = ProductService.getInstance();

        let product_name = req.body.name; // Todo 要檢查使用者有沒有傳該值
        await productService.addProduct(product_name, 1, 500, "good");// 要有錯誤處理
        res.send("ok");
    }

    static async getProductById(req: Request, res: Response, next: NextFunction) { // 這裡就要去拿到照片
        let productService = ProductService.getInstance();
        let result = await productService.findProductById(Number(req.params.id));
        res.send(result);
    }

    static async getAllProduct(req: Request, res: Response, next: NextFunction) {
        let productService = ProductService.getInstance();
        let result = await productService.findAllProduct();
        res.send(result);
    }
}