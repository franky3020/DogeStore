const mysql = require('mysql2');
import * as dotenv from "dotenv";
dotenv.config();

export const connection = mysql.createConnection({

  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PWD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT as unknown as number

});