import ProductDAO from "../../repositories/ProductDAO";
import mysql from "mysql2";
import {createNewDatabase, deletesDatabase} from "../../db/db";
import Product from "../../entity/Product";


testFindById();

async function testFindById() {
    let databaseName = "test";

    let connection: mysql.Connection = await createNewDatabase(databaseName);

    let productDAO = new ProductDAO(connection);

    let product: Product = await productDAO.findById(5);

    console.log(product.toString());

}


async function testFindAll() {
    let databaseName = "test";

    let connection: mysql.Connection = await createNewDatabase(databaseName);

    let productDAO = new ProductDAO(connection);

    let products: Product[] = await productDAO.findAll();

    for(const product of products) {
        console.log(product.toString());
    }

}
