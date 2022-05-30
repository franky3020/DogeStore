import UserDAO from "../../repositories/UserDAO";
import mysql from "mysql2";
import { deletesDatabase } from "../../db/db";

import {initAlltables} from "../../db/seed";
import User from "../../entity/User";
import MySQLConnectionPool from "../../db/MySQLConnectionPool";

let testDatabaseName = "testDatabase_user";
let connection: mysql.Connection;
let userDAO: UserDAO;

const user_init_1 = new User(4, "test@test", "user_name", "yaya");
const user_init_2 = new User(7, "test@test", "user_name", "yaya");

beforeAll(async () => {
    connection = await initAlltables(testDatabaseName);
    let connectionPool = MySQLConnectionPool.getPool(testDatabaseName);
    userDAO = new UserDAO(connectionPool);

    await userDAO.create(user_init_1);
    await userDAO.create(user_init_2);
});

afterAll(async () => { // 直接刪除整個資料庫就好 Todo 這之後要把它放在所有DAO測試之後
    await deletesDatabase(testDatabaseName);
    connection.end();
    MySQLConnectionPool.endPool(testDatabaseName);
});

describe("User CRUD", ()=>{

    test("find user", async ()=> {

        let user: User|null = await userDAO.findById(user_init_1.id as number);

        expect(user).not.toBeNull();

        if ( user !== null ) {
            expect(user).toEqual(user_init_1);
        }

    })

    test("findAll", async ()=> {
        let users: User[] = await userDAO.findAll();
        let expectLength = 2;
        expect(users.length).toEqual(expectLength);
    })

    test("not find", async ()=> {
        let user = await userDAO.findById(0);
        expect(user).toBeNull();
    })
    
    test("update", async ()=> {

        let user_updata: User = new User(7, "test@test_user_updata", "user_updata", "user_updata_ya");

        await userDAO.update(user_updata);

        let user: User|null = await userDAO.findById(user_updata.id as number);
        expect(user).not.toBeNull();

        if ( user !== null && user_updata !== null) {
            expect(user).toEqual(user_updata);
        }

        await userDAO.update(user_init_2);

    })


    test("Delete", async ()=> {

        if(user_init_1.id !== null) {
            await userDAO.deleteById( user_init_1.id );
            
            let user: User|null = await userDAO.findById(user_init_1.id);
            expect(user).toBeNull(); 
            
        }
        
        await userDAO.create(user_init_1);

    })
    



});


