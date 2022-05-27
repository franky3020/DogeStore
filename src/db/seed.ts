
import {connection} from "./db"
import ProductsSeed from "./ProductSeed";

let productSeed = new ProductsSeed(connection);
productSeed.drop();
productSeed.createTable();






