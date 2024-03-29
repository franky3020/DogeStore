import "dotenv/config";

import { createNewDatabase, deletesDatabase, isDatabaseExist } from "./db";
import SeedDBFromSQLFile from "./SeedDBFromSQLfile";
import path from "path";

import User from "../entity/User";
import Product from "../entity/Product";
import ProductDAO from "../repositories/ProductDAO";
import MySQLConnectionPool from "../db/MySQLConnectionPool";
import UserDAO from "../repositories/UserDAO";

import UserService from "../service/UserService";

import { ADMIN_ID } from "../config/config";

export async function resetDB(databaseName: string) {
  await deletesDatabase(databaseName);
  await createNewDatabase(databaseName);

  let connectionPool = MySQLConnectionPool.getPool(databaseName);
  let seedDBFromSQLFile = new SeedDBFromSQLFile(connectionPool);

  await seedDBFromSQLFile.createTable(path.join(__dirname, "init.sql"));
}

export async function initDBIfNotExist(databaseName: string) {
  if ((await isDatabaseExist(databaseName)) === true) {
    return;
  }

  await createNewDatabase(databaseName);

  let connectionPool = MySQLConnectionPool.getPool(databaseName);
  let seedDBFromSQLFile = new SeedDBFromSQLFile(connectionPool);

  await seedDBFromSQLFile.createTable(path.join(__dirname, "init.sql"));
}

export async function addAdminToDB(databaseName: string) {
  let connectionPool = MySQLConnectionPool.getPool(databaseName);

  let admin_email = process.env.ADMIN_EMAIL as string;
  let admin_password = process.env.ADMIN_PASSWORD as string;

  const user_init = new User(1, admin_email, "admin", admin_password);

  let userDAO = new UserDAO(connectionPool);
  let userService = new UserService(userDAO);

  if ((await userService.checkUserExistById(ADMIN_ID)) === false) {
    await userService.addNewUser(
      user_init.email,
      user_init.nickname,
      user_init.password,
      user_init.id as number,
    );
  }
}

export async function insertFakeData(databaseName: string) {
  let connectPool = MySQLConnectionPool.getPool(databaseName);

  const user_init_2 = new User(2, "other@gmail.com", "other", "12345678");

  // 一定要先有user 因為外健限制

  let userDAO = new UserDAO(connectPool);
  let userService = new UserService(userDAO);
  await userService.addNewUser(
    user_init_2.email,
    user_init_2.nickname,
    user_init_2.password,
    user_init_2.id as number,
  );

  const product_init_1 = new Product(1, "product_init_1", 1, 100, "m");
  const product_init_2 = new Product(2, "product_init_2", 1, 200, "m");
  const product_init_3 = new Product(3, "product_init_3", 1, 300, "m");

  let productDAO = new ProductDAO(connectPool);

  await Promise.all([
    productDAO.create(product_init_1),
    productDAO.create(product_init_2),
    productDAO.create(product_init_3),
  ]);
}

if (require.main === module) {
  resetDB("db_create_from_seed").then(() => {
    MySQLConnectionPool.endPool("db_create_from_seed");
  });
}
