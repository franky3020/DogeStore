import ProductsSeed from "../../db/ProductSeed";
import mysql from "mysql2";

import {createNewDatabase, deletesDatabase} from "../../db/db";


testCreateDB();

async function testCreateDB() {
    let databaseName = "test526";

    deletesDatabase(databaseName);
    let connection: mysql.Connection = await createNewDatabase(databaseName);

    let productSeed = new ProductsSeed(connection);
    productSeed.drop();
    productSeed.create();

    for(let i = 0 ; i < 100 ; i++) {
        await productSeed.addAProduct();
    }


    let sql :string = "SELECT * FROM `Products`";

    connection.query(sql, function (err, result) {
        if (err) throw err;

        console.log(result);
    });
}



