import ProductDAO from "../../repositories/ProductDAO";
import UserDAO from "../../repositories/UserDAO";
import { deletesDatabase } from "../../db/db";
import Product from "../../entity/Product";
import { resetDB } from "../../db/seed";
import User from "../../entity/User";
import MySQLConnectionPool from "../../db/MySQLConnectionPool";

const testDatabaseName = "testDatabase_product";
let productDAO: ProductDAO;
let userDAO: UserDAO;

beforeAll(async () => {
  await resetDB(testDatabaseName);

  let connectionPool = MySQLConnectionPool.getPool(testDatabaseName);
  productDAO = new ProductDAO(connectionPool);
  userDAO = new UserDAO(connectionPool);
});

afterAll(async () => {
  await deletesDatabase(testDatabaseName);
  MySQLConnectionPool.endPool(testDatabaseName);
});

const user_init = new User(1, "email", "nickname", "pw");

const p1_init: Product = new Product(1, "name_1", 1, 100, "describe_1");
const p2_init: Product = new Product(2, "name_1", 1, 200, "describe_2");

beforeEach(async () => {
  await userDAO.create(user_init);

  await productDAO.create(p1_init);
  await productDAO.create(p2_init);
});

afterEach(async () => {
  await productDAO.deleteById(p1_init.id as number);
  await productDAO.deleteById(p2_init.id as number);

  // Need no one product fk to that user, then can delete
  await userDAO.deleteById(user_init.id as number);
});

test("find product p1", async () => {
  let p1: Product | null = await productDAO.findById(p1_init.id as number);

  expect(p1).not.toBeNull();

  expect(p1).toEqual(p1_init);
});

test("findAll", async () => {
  let products: Product[] = await productDAO.findAll();
  let expectLength = 2;
  expect(products.length).toEqual(expectLength);
});

test("not find", async () => {
  let not_exist_id = 0;
  let product = await productDAO.findById(not_exist_id);
  expect(product).toBeNull();
});

test("update", async () => {
  let p_updata: Product = new Product(p1_init.id, "updata", 1, 1000, "updata");
  await productDAO.update(p_updata);

  let product: Product | null = await productDAO.findById(p1_init.id as number);

  expect(product).not.toBeNull();
  expect(product).toEqual(p_updata);
});

test("Delete", async () => {
  await productDAO.deleteById(p1_init.id as number);

  let product: Product | null = await productDAO.findById(p1_init.id as number);
  expect(product).toBeNull();
});
