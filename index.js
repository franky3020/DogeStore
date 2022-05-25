"use strict";
exports.__esModule = true;
var mysql_1 = require("./mysql");
mysql_1.connection.connect(function (err) {
    console.log("error");
    console.log(err);
    process.exit();
    console.log("OVER");
});
// connection.ping();
