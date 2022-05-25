"use strict";
exports.__esModule = true;
exports.connection = void 0;
var mysql = require('mysql2');
var dotenv = require("dotenv");
dotenv.config();
exports.connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});
