import ProductsSeed from "../../db/ProductSeed";

import {connection} from "../../db/db";



async function testCol() {

    await ProductsSeed.drop();
    
    await ProductsSeed.create();

    for(let i = 0 ; i < 100 ; i++) {
        await ProductsSeed.addAProduct();
    }


    let sql :string = "SELECT * FROM `database`.`Products`";

    connection.query(sql, function (err, result) {
        if (err) throw err;

        console.log(result);
    });
}

testCol();


