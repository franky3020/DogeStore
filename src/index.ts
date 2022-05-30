

import express, { Express, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
dotenv.config();

import ProductCtrl from "./controller/ProductCtrl";
import {initAlltables, insertFakeData} from "./db/seed";
import MySQLConnectionPool from "./db/MySQLConnectionPool";

const app: Express = express();
app.use(express.json());

const port = process.env.SERVER_PORT;

import { validate, ValidationError, Joi } from "express-validation";

const productValidation = {
    body: Joi.object({
      name: Joi.string()
        .required()
    }),
  }

app.get('/product/:id', ProductCtrl.getProductById);
app.get('/product', ProductCtrl.getAllProduct);
app.post('/product', validate(productValidation), ProductCtrl.addNewProduct);

// 有4個參數的方法 一定是用來做錯誤處理的
app.use(function( err: any, req: Request, res: Response, next: NextFunction) {
    if (err instanceof ValidationError) {
        return res.status(err.statusCode).json(err)
    }

    return res.status(500).json(err)
})


app.get('/stop', function(req, res){
  MySQLConnectionPool.endAllPool();
  res.send("stop");

  process.exit();
});


//The 404 Route (ALWAYS Keep this as the last route)
app.get('*', function(req, res){
    res.status(404).send('nothing');
});


app.listen(port, async () => {

  let con = await initAlltables(process.env.DB_NAME as string);
  con.end();
  await insertFakeData(process.env.DB_NAME as string);
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});



