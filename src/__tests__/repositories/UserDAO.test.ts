import UserDAO from "../../repositories/UserDAO";
import { deletesDatabase } from "../../db/db";

import { initAlltables } from "../../db/seed";
import User from "../../entity/User";
import MySQLConnectionPool from "../../db/MySQLConnectionPool";

const testDatabaseName = "testDatabase_user";
let userDAO: UserDAO;

const user_init_1 = new User(1, "test@test", "user_name", "yaya");
const user_init_2 = new User(2, "test@test", "user_name", "yaya");

beforeAll(async () => {
    await initAlltables(testDatabaseName);
    let connectionPool = MySQLConnectionPool.getPool(testDatabaseName);
    userDAO = new UserDAO(connectionPool);

    await userDAO.create(user_init_1);
    await userDAO.create(user_init_2);
});

afterAll(async () => {
    await deletesDatabase(testDatabaseName);
    MySQLConnectionPool.endPool(testDatabaseName);
});


test("find user", async () => {

    let user: User | null = await userDAO.findById(user_init_1.id as number);

    expect(user).not.toBeNull();

    if (user !== null) {
        expect(user).toEqual(user_init_1);
    }

})

test("findAll", async () => {
    let users: User[] = await userDAO.findAll();
    let expectLength = 2;
    expect(users.length).toEqual(expectLength);
})

test("not find", async () => {

    let user = await userDAO.findById(0);
    expect(user).toBeNull();
   
})

test("update", async () => {

    let user_update: User = new User(user_init_2.id, "test@test_user_updata", "user_updata", "user_updata_ya");

    await userDAO.update(user_update);

    let user: User | null = await userDAO.findById(user_update.id as number);

    expect(user).not.toBeNull();
    expect(user_update).not.toBeNull();
    
    expect(user).toEqual(user_update);
    
    // recovery
    await userDAO.update(user_init_2);
    let recoveryUser: User | null = await userDAO.findById(user_init_2.id as number);

    expect(recoveryUser).not.toBeNull();
    expect(recoveryUser).toEqual(user_init_2);


})


test("Delete", async () => {
    await userDAO.deleteById(user_init_1.id as number);

    let user: User | null = await userDAO.findById(user_init_1.id as number);
    expect(user).toBeNull();

    // recovery
    await userDAO.create(user_init_1);

    let recoveryUser: User | null = await userDAO.findById(user_init_1.id as number);
    expect(recoveryUser).not.toBeNull();
    expect(recoveryUser).toEqual(user_init_1);

})


