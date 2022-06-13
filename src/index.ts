import 'dotenv/config';
import express, { Express, Request, Response, NextFunction } from 'express';
import Routes from './routes';
import { initAlltables, insertFakeData } from "./db/seed";
import { ValidationError } from "express-validation";
let cors = require('cors');
import path from "path";


const app: Express = express();

app.disable('x-powered-by'); // 官網寫 可防止駭客用來探測有沒有用express 架的網站
app.use(express.json());
app.use(cors())

app.use('/public', express.static(path.join(__dirname, '../public')));
new Routes(app);

// 有4個參數的方法 一定是用來做錯誤處理的 一定要放在後面
app.use(function (err: any, req: Request, res: Response, next: NextFunction) {
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json(err)
  }

  console.error(err);
  return res.status(500).json(err)
})


//The 404 Route (ALWAYS Keep this as the last route)
app.get('*', function (req, res) {
  res.status(404).send('nothing');
});


let initFakeDB = async () => {
  await initAlltables(process.env.DB_NAME as string);
  await insertFakeData(process.env.DB_NAME as string);
}

initFakeDB().then(() => {
  const port = process.env.SERVER_PORT;
  app.listen(port, async () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
  });
}).catch((err) => {
  console.error("init DB fail");
  console.error(err);
})







