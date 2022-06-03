

import express, { Express, Request, Response, NextFunction } from 'express';

import dotenv from 'dotenv';
dotenv.config();

import Routes from './routes';
import {initAlltables, insertFakeData} from "./db/seed";
import MySQLConnectionPool from "./db/MySQLConnectionPool";
import { ValidationError } from "express-validation";
var cors = require('cors');
import path from "path";

const app: Express = express();

app.disable('x-powered-by'); // 官網寫 可防止駭客用來探測有沒有用express 架的網站
app.use(express.json());
app.use(cors())

app.use('/public', express.static( path.join(__dirname, '../public') ) );
new Routes(app);


app.get('/stop', function(req, res){
  MySQLConnectionPool.endAllPool();
  res.send("stop");
  process.exit();
});

// 有4個參數的方法 一定是用來做錯誤處理的 一定要放在後面
app.use(function( err: any, req: Request, res: Response, next: NextFunction) {
  if (err instanceof ValidationError) {
      return res.status(err.statusCode).json(err)
  }

  console.error(err);

  return res.status(500).json(err)
})


//The 404 Route (ALWAYS Keep this as the last route)
app.get('*', function(req, res){
    res.status(404).send('nothing');
});

const port = process.env.SERVER_PORT;
app.listen(port, async () => {

  //Todo  這裡要修正 沒錯誤處理
  await initAlltables(process.env.DB_NAME as string);
  await insertFakeData(process.env.DB_NAME as string);
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});



