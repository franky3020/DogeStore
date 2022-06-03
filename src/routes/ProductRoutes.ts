
import { Router } from 'express';

import ProductCtrl from '../controller/ProductCtrl';
import { validate, ValidationError, Joi } from "express-validation";

const multer  = require('multer');
const uploadFile = multer();

class ProductRoutes {

    router = Router();
    productCtrl = new ProductCtrl();

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

    constructor() {
        this.intializeRoutes();
    }

    intializeRoutes() {
        this.router.route('/:id').get(this.productCtrl.getProductById);
        this.router.route('/').get(this.productCtrl.getAllProduct);
        this.router.route('/').post(validate(this.productValidation), this.productCtrl.addNewProduct);
        this.uploadProdeutImg();
    }

    uploadProdeutImg() {
        this.router.route('/upload').post(uploadFile.single('uploaded_file'), this.productCtrl.addProductImg);
    }


}

export default new ProductRoutes().router;