import Product from "../../entity/Product";

describe("Product Entity test", () => {
  test("photo init", () => {
    let product = new Product(1, "test", 1, 100, "test_d");

    let actual: string[] = product.photos;
    let expected: string[] = [];
    expect(actual).toEqual(expected);

    let productHasInput = new Product(1, "test", 1, 100, "test_d", ["url"]);
    expect(productHasInput.photos).toEqual(["url"]);
  });

  test("toSring", () => {
    let product = new Product(1, "test", 1, 100, "test_d", ["0", "1"]);

    let actual: string = product.toString();

    let expected =
      "id: 1\nname: test\nprice: 100\ndescribe: test_d\nphotos: [ 0, 1 ]\n";

    expect(actual).toBe(expected);
  });
});
