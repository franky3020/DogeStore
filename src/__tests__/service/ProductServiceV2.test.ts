import ProductService from "../../service/ProductService";
import fs from "fs";
import path from "path";

import ProductDAO from "../../repositories/ProductDAO";
import Product from "../../entity/Product";



const product_init_1 = {
    id: 1,
    name: "test_name",
    create_user_id: 1,
    price: 100,
    describe: "test_describe",
    photos: []
}

test("FindProductById", async () => {
    let mockProductDAO = {
        findById: jest.fn((id: number) => {
            return new Product(id, product_init_1.name, product_init_1.create_user_id, product_init_1.price, product_init_1.describe);
        })
    };

    const productService = new ProductService(mockProductDAO as unknown as ProductDAO);

    let result = await productService.findProductById(product_init_1.id);
    expect(result).toEqual(product_init_1);
});


test("Not find that product", async () => {


    let mockProductDAO = {
        findById: jest.fn((id: number) => {
            return null
        })
    };

    const productService = new ProductService(mockProductDAO as unknown as ProductDAO);

    let result = await productService.findProductById(2);
    expect(result).toEqual({});
});


test("Find all product", async () => {

    let product_1 = {
        id: 1,
        name: "test_name",
        create_user_id: 1,
        price: 100,
        describe: "test_describe",
        photos: []
    }

    let product_2 = {
        id: 2,
        name: "test_name",
        create_user_id: 1,
        price: 200,
        describe: "test_describe",
        photos: []
    }

    let products = [new Product(product_1.id, product_1.name, product_1.create_user_id, product_1.price, product_1.describe),
    new Product(product_2.id, product_2.name, product_2.create_user_id, product_2.price, product_2.describe)]


    let mockProductDAO = {
        findAll: jest.fn(() => {
            return products
        })
    };

    const productService = new ProductService(mockProductDAO as unknown as ProductDAO);

    let result = await productService.findAllProduct();
    expect(result).toEqual([product_1, product_2]);
});



test("Add a product image and delete", async () => {

    const productService = new ProductService(null as unknown as ProductDAO);

    let createProductId = 0;
    let testString: string = "test-string";
 

    await productService.addProductImg(createProductId, Buffer.from(testString));

    let isImgExist = fs.existsSync(path.join(ProductService.SAVE_PRODUCT_IMAGES_PATH, createProductId.toString(), ProductService.PRODUCT_IMG_FILE_NAME));
    expect(isImgExist).toBe(true);

    await productService.deleteProductImg(createProductId);

    isImgExist = fs.existsSync(path.join(ProductService.SAVE_PRODUCT_IMAGES_PATH, createProductId.toString(), ProductService.PRODUCT_IMG_FILE_NAME));
    expect(isImgExist).toBe(false);



});

test("add product", async () => {

    let mockProductDAO = {
        create: jest.fn()
    };

    const productService = new ProductService(mockProductDAO as unknown as ProductDAO);

    await productService.addProduct(product_init_1.name, product_init_1.create_user_id, product_init_1.price, product_init_1.describe);

    let mockFnCallTime = mockProductDAO.create.mock.lastCall.length;
    expect(mockFnCallTime).toBe(1);

});

test("delete product", async () => {

    let mockProductDAO = {
        deleteById: jest.fn()
    };

    const productService = new ProductService(mockProductDAO as unknown as ProductDAO);

    productService.deleteProductImg = jest.fn();

    await productService.deleteProductById(1);

    let mockFnCallTime = mockProductDAO.deleteById.mock.lastCall.length;
    expect(mockFnCallTime).toBe(1);

    let mockDeleteImgFn = productService.deleteProductImg as jest.Mock<any, any>;
    expect(mockDeleteImgFn.mock.lastCall.length).toBe(1);
   



});


test("Add product zip file", async () => {

    const productService = new ProductService(null as unknown as ProductDAO);

    let createProductId = 1;
    let zipFilestr: string = "test-string";

    await productService.addProductZipFile(createProductId, Buffer.from(zipFilestr));

    let isZipFileExist = fs.existsSync(path.join(ProductService.SAVE_PRODUCT_ZIP_FILE_PATH, createProductId.toString(), ProductService.PRODUCT_ZIP_FILE_NAME));
    expect(isZipFileExist).toBe(true);
});


test("Get product zip file path", () => {

    const productService = new ProductService(null as unknown as ProductDAO);

    let createProductId = 1;
  
    let filePath = productService.getProductZipFilePath(createProductId);

    expect(filePath).toBe(path.join(ProductService.SAVE_PRODUCT_ZIP_FILE_PATH, createProductId.toString(), ProductService.PRODUCT_ZIP_FILE_NAME));
});