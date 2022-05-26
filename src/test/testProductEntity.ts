import Product from "../entity/Product";

export default function test() {
    let product1 = new Product("product1", 100, "TA D", ["goodURL", "badURL"]);
    let product2 = new Product("product2", 100, "TA D");
    console.log(product1.toString());
    console.log(product2.toString());
}
