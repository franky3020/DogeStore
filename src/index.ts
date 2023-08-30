import "dotenv/config";
import express, { Express, Request, Response, NextFunction } from "express";
import Routes from "./routes";
import {
  resetDB,
  insertFakeData,
  initDBIfNotExist,
  addAdminToDB,
} from "./db/seed";
import { ValidationError } from "express-validation";
let cors = require("cors");
import path from "path";
import MySQLConnectionPool from "./db/MySQLConnectionPool";

const app: Express = express();

app.disable("x-powered-by"); // 官網寫 可防止駭客用來探測有沒有用express 架的網站
app.use(express.json());
app.use(cors());

app.use("/public", express.static(path.join(__dirname, "../public")));
Routes.init(app);

// 有4個參數的方法 一定是用來做錯誤處理的 一定要放在後面
app.use(function (err: any, req: Request, res: Response, next: NextFunction) {
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json(err);
  }

  console.error(err);
  return res.status(500).json(err);
});

//The 404 Route (ALWAYS Keep this as the last route)
app.get("*", function (req, res) {
  res.status(404).send("nothing");
});

const dbName = process.env.DB_NAME as string;

let createFakeDB = async () => {
  await resetDB(dbName);
  await addAdminToDB(dbName);
  await insertFakeData(dbName);
};

let initDB = async () => {
  await initDBIfNotExist(dbName);
  await addAdminToDB(dbName);
};

const port = 5000;
if (process.env.NODE_ENV === "development") {
  createFakeDB()
    .then(() => {
      app.listen(port, () => {
        console.log(
          `⚡️[server]: development Server is running at http://localhost:${port}`,
        );
      });
    })
    .catch((err) => {
      console.error(" createFakeDB fail ");
      console.error(err);

      process.exit();
    });
} else if (process.env.NODE_ENV === "production") {
  initDB()
    .then(() => {
      app.listen(port, () => {
        console.log(
          `⚡️[server]: production Server is running at https://localhost:${port}`,
        );
      });
    })
    .catch((err) => {
      console.error(" init DB fail ");
      console.error(err);

      process.exit();
    });
} else {
  throw Error("you need to choose development or production env");
}

process.on("SIGINT", function () {
  MySQLConnectionPool.endAllPool();
  process.exit();
});
