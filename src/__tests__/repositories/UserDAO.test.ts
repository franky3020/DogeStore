import UserDAO from "../../repositories/UserDAO";
import { deletesDatabase } from "../../db/db";

import { initAlltables } from "../../db/seed";
import User from "../../entity/User";
import MySQLConnectionPool from "../../db/MySQLConnectionPool";

const testDatabaseName = "testDatabase_user";
let userDAO: UserDAO;


beforeAll(async () => {
    await initAlltables(testDatabaseName);
    let connectionPool = MySQLConnectionPool.getPool(testDatabaseName);
    userDAO = new UserDAO(connectionPool);
});

afterAll(async () => {
    await deletesDatabase(testDatabaseName);
    MySQLConnectionPool.endPool(testDatabaseName);
});


const user_init_1 = new User(1, "test@test", "user_name", "pw");
const user_init_2 = new User(2, "2test@test", "2user_name", "2pw");

beforeEach(async () => {
    await userDAO.create(user_init_1);
    await userDAO.create(user_init_2);
});

afterEach(async () => {
    await userDAO.deleteById(user_init_1.id as number);
    await userDAO.deleteById(user_init_2.id as number);
});


test("Find a user", async () => {

    let user: User | null = await userDAO.findById(user_init_1.id as number);

    expect(user).not.toBeNull();

    if (user !== null) {
        expect(user).toEqual(user_init_1);
    }

})

test("Find All user", async () => {
    let users: User[] = await userDAO.findAll();
    let expectLength = 2;
    expect(users.length).toEqual(expectLength);
})

test("Not find user", async () => {

    let user_id = 0; // not exist id
    let user = await userDAO.findById(user_id);
    expect(user).toBeNull();
   
})

test("Update user", async () => {

    let user_update: User = new User(user_init_2.id, "test@test_user_updata", "user_updata", "user_updata_ya");

    await userDAO.update(user_update);

    let user: User | null = await userDAO.findById(user_update.id as number);

    expect(user).not.toBeNull();
    expect(user_update).not.toBeNull();
    
    expect(user).toEqual(user_update);

})


test("Delete user", async () => {
    await userDAO.deleteById(user_init_1.id as number);
    let user: User | null = await userDAO.findById(user_init_1.id as number);
    expect(user).toBeNull();
})


