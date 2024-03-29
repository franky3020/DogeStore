import Product from "../entity/Product";
import mysql from "mysql2";
import { GetProductDBRes } from "../entity/GetProductDBRes";

export default class ProductDAO {
  private connection: mysql.Pool;

  constructor(connection: mysql.Pool) {
    this.connection = connection;
  }

  create(product: Product): Promise<any> {
    let connection = this.connection;

    if (product.id !== null) {
      let sql =
        "INSERT INTO `Products`(`id`,`name`,`create_user_id`,`price`, `describe`)VALUES(?,?,?,?,?)";
      return connection
        .promise()
        .query(sql, [
          product.id,
          product.name,
          product.create_user_id,
          product.price,
          product.describe,
        ]);
    } else {
      let sql =
        "INSERT INTO `Products`(`name`,create_user_id,`price`,`describe`)VALUES(?,?,?,?)";
      return connection
        .promise()
        .query(sql, [
          product.name,
          product.create_user_id,
          product.price,
          product.describe,
        ]);
    }
  }

  update(product: Product): Promise<any> {
    let connection = this.connection;

    let sql =
      "UPDATE `Products` SET `name` = ?, `create_user_id` = ?,`price` = ?, `describe` = ? WHERE `id` = ?"; // 記得這回傳依舊是list

    return connection
      .promise()
      .execute(sql, [
        product.name,
        product.create_user_id,
        product.price,
        product.describe,
        product.id,
      ]);
  }

  findById(id: number): Promise<Product | null> {
    let connection = this.connection;

    let sql = "SELECT * FROM `Products` WHERE `id` = ?"; // 記得這回傳依舊是list

    return new Promise(async (resolve, reject) => {
      let rows: any, fields: any;
      try {
        [rows, fields] = await connection.promise().execute(sql, [id]);
      } catch (err) {
        return reject(err);
      }

      type productDBRes = {
        id: number;
        name: string;
        create_user_id: number;
        price: number;
        describe: string;
      };

      const productDBResArray: productDBRes[] = JSON.parse(
        JSON.stringify(rows),
      );

      if (productDBResArray.length === 0) {
        return resolve(null);
      }

      const a_productDBRes = productDBResArray[0];
      const product = new Product(
        a_productDBRes.id,
        a_productDBRes.name,
        a_productDBRes.create_user_id,
        a_productDBRes.price,
        a_productDBRes.describe,
      );
      return resolve(product);
    });
  }

  findAll(): Promise<Product[]> {
    let sql =
      " \
        SELECT \
            `Products`.`id`, \
            `Products`.`name`, \
            `Products`.`create_user_id`, \
            `User`.`nickname`, \
            `Products`.`price`, \
            `Products`.`describe` \
        FROM \
            `Products` \
            JOIN \
            `User` \
            ON `Products`.`create_user_id` = `User`.`id`";

    let connection = this.connection;
    let returnProducts: Product[] = [];

    return new Promise(async (resolve, reject) => {
      let rows: any, fields: any;

      try {
        [rows, fields] = await connection.promise().query(sql);
      } catch (err) {
        return reject(err);
      }

      let jResult = JSON.parse(JSON.stringify(rows));

      for (const getProductRes of jResult as GetProductDBRes[]) {
        let a_product = new Product(
          getProductRes.id,
          getProductRes.name,
          getProductRes.create_user_id,
          getProductRes.price,
          getProductRes.describe,
          [],
        );

        a_product.setCreateUserName(getProductRes.nickname);
        returnProducts.push(a_product);
      }
      return resolve(returnProducts);
    });
  }

  deleteById(id: number): Promise<any> {
    let connection = this.connection;

    let sql = "DELETE FROM `Products` WHERE `id` = ?";
    return connection.promise().execute(sql, [id]);
  }
}
