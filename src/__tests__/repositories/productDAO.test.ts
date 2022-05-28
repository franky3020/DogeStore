import ProductDAO from "../../repositories/ProductDAO";
import UserDAO from "../../repositories/UserDAO";
import mysql from "mysql2";
import { deletesDatabase } from "../../db/db";
import Product from "../../entity/Product";


import {initAlltables} from "../../db/seed";

let testDatabaseName = "testDatabase";
let productDAO: ProductDAO;
let connection: mysql.Connection;
let userDAO: UserDAO;


const p1_init: Product = new Product(55, "p_1", 1, 200, "p_d");
const p2_init: Product = new Product(66, "p_2", 1, 200, "p_d");

beforeAll(async () => {
    connection = await initAlltables(testDatabaseName);
    productDAO = new ProductDAO(connection);

    userDAO = new UserDAO(connection);

    userDAO.easyCreate(1,"u_email", "franky", "ya");
    await productDAO.create(p1_init);
    await productDAO.create(p2_init);

});

afterAll(async () => { // 直接刪除整個資料庫就好 Todo 這之後要把它放在所有DAO測試之後
    await deletesDatabase(testDatabaseName);
    connection.end();
});

describe("Product CRUD", ()=>{

    test("find p1", async ()=> {

        let p1: Product|null = await productDAO.findById(1);

        if ( p1 !== null ) {
            expect(p1.id).toEqual(p1_init.id);
            expect(p1.name).toEqual(p1_init.name);
            expect(p1.price).toEqual(p1_init.price);
            expect(p1.describe).toEqual(p1_init.describe);
        }
        

    })

    test("findAll", async ()=> {
        let products: Product[] = await productDAO.findAll();
        let expectLength = 2;
        expect(products.length).toEqual(expectLength);
    })

    test("not find", async ()=> {
        let product = await productDAO.findById(0);
        expect(product).toBeNull();
    })
    
    test("update", async ()=> {

        let p_updata: Product = new Product(p1_init.id, "updata", 1, 200, "updata");

        await productDAO.update(p_updata);

        let product: Product|null = await productDAO.findById(p1_init.id as number);

        if ( p_updata !== null && product !== null) {
            expect(product.id).toBe(p_updata.id);
            expect(product.name).toBe(p_updata.name);
            expect(product.create_user_id).toBe(p_updata.create_user_id);
            expect(product.price).toBe(p_updata.price);
            expect(product.describe).toBe(p_updata.describe);
        }

        await productDAO.update(p1_init);

    })


    test("Delete", async ()=> {

        if(p1_init.id !== null) {
            await productDAO.deleteById( p1_init.id );
            
            let product: Product|null = await productDAO.findById(p1_init.id);
            expect(product).toBeNull(); 
            
        }
        
        await productDAO.create(p1_init);

    })
    



});


