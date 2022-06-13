
import PurchaseListDAO from "../../repositories/PurchaseListDAO";
import User from "../../entity/User";
import UserDAO from "../../repositories/UserDAO";
import { deletesDatabase } from "../../db/db";
import { initAlltables } from "../../db/seed";
import MySQLConnectionPool from "../../db/MySQLConnectionPool";
import ProductDAO from "../../repositories/ProductDAO";
import Product from "../../entity/Product";

const testDatabaseName = "testDatabase_purchase";

let userDAO: UserDAO;
let purchaseListDAO: PurchaseListDAO;
let productDAO: ProductDAO;

beforeAll(async () => {
    await initAlltables(testDatabaseName);
    let connectionPool = MySQLConnectionPool.getPool(testDatabaseName);

    userDAO = new UserDAO(connectionPool);
    purchaseListDAO = new PurchaseListDAO(connectionPool);
    productDAO = new ProductDAO(connectionPool);
});

afterAll(async () => {
    await deletesDatabase(testDatabaseName);
    MySQLConnectionPool.endPool(testDatabaseName);
});

const user_init = new User(1, "email", "nickname", "pw");
const p1_init: Product = new Product(1, "name_1", 1, 200, "describe_1");

beforeEach(async () => {
    await userDAO.create(user_init);

    await productDAO.create(p1_init);

    let now_date = new Date();
    now_date.setMilliseconds(0); // because DB can't store milliseconds
    await purchaseListDAO.insertProductToList(user_init.id as number, now_date, p1_init.id as number);
});

afterEach(async () => {

    await purchaseListDAO.deletePurchaseInList(user_init.id as number, p1_init.id as number);
    await productDAO.deleteById(p1_init.id as number);

    // Need no one product fk to that user, then can delete
    await userDAO.deleteById(user_init.id as number);
});

test("find a purchase", async () => {

    let products = await purchaseListDAO.findUserPurchase(user_init.id as number);

    expect(products).not.toBe(null);
    expect(products.length).toBe(1);

})

test("Not find purchase", async () => {

    let not_exist_user_id = 0;
    let products = await purchaseListDAO.findUserPurchase(not_exist_user_id);

    expect(products).toEqual([]);
})

test("When insert same user-product, will throw error", async () => {

    let now_date = new Date();
    now_date.setMilliseconds(0); // because DB can't store milliseconds

    await expect(
        purchaseListDAO.insertProductToList(user_init.id as number, now_date, p1_init.id as number)
    ).rejects.toThrow();

})
