
import Product from "../../entity/Product";


describe("Product Entity test", () => {

    test('photo init', () => {
        let product = new Product(1, "test", 100, "test_d");

        let expected: string[] = [];

        let actual: string[] = product.photos;

        expect(expected).toEqual(actual);
        
        let productHasInput = new Product(1, "test", 100, "test_d", [ "url" ]);
        expect([ "url" ]).toEqual(productHasInput.photos);





    });


    test('toSring', () => {
        let product = new Product(1, "test", 100, "test_d", [ "0", "1" ]);

        let expected = "id: 1\nname: test\nprice: 100\ndescribe: test_d\nphotos: [ 0, 1 ]\n";

        let actual: string = product.toString();

        expect(expected).toBe(actual);
    });

    
});




