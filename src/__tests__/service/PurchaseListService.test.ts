import Product from "../../entity/Product";

import PurchaseListService from "../../service/PurchaseListService";

const product_init_1 = {
    id: 1,
    name: "test_name",
    create_user_id: 1,
    price: 100,
    describe: "test_describe",
    photos: []
}

const product_init_2 = {
    id: 2,
    name: "2_test_name",
    create_user_id: 1,
    price: 200,
    describe: "2_test_describe",
    photos: []
}



test("Check user has product", async () => {
    let mockPurchaseListDAO = {
        findUserPurchase: jest.fn()
    };

    mockPurchaseListDAO.findUserPurchase.mockReturnValue(
        [
            new Product(product_init_1.id, product_init_1.name, product_init_1.create_user_id, product_init_1.price, product_init_1.describe),
            new Product(product_init_2.id, product_init_2.name, product_init_2.create_user_id, product_init_2.price, product_init_2.describe)
        ]);

    const purchaseListService = new PurchaseListService(mockPurchaseListDAO as any);

    let isUserHas = await purchaseListService.checkUserhasProduct(1, product_init_1.id);
    expect(isUserHas).toBe(true);
});


test("Check user NOT has that product", async () => {
    let mockPurchaseListDAO = {
        findUserPurchase: jest.fn()
    };

    mockPurchaseListDAO.findUserPurchase.mockReturnValue(
        [
            new Product(product_init_2.id, product_init_2.name, product_init_2.create_user_id, product_init_2.price, product_init_2.describe)
        ]);

    const purchaseListService = new PurchaseListService(mockPurchaseListDAO as any);

    let isUserHas = await purchaseListService.checkUserhasProduct(1, product_init_1.id);
    expect(isUserHas).toBe(false);
});

test("Check user NOT has any product", async () => {
    let mockPurchaseListDAO = {
        findUserPurchase: jest.fn()
    };

    mockPurchaseListDAO.findUserPurchase.mockReturnValue([]);

    const purchaseListService = new PurchaseListService(mockPurchaseListDAO as any);

    let isUserHas = await purchaseListService.checkUserhasProduct(1, product_init_1.id);
    expect(isUserHas).toBe(false);
});


test("Get user purchase list", async () => {
    let mockPurchaseListDAO = {
        findUserPurchase: jest.fn()
    };

    mockPurchaseListDAO.findUserPurchase.mockReturnValue(
        [
            new Product(product_init_1.id, product_init_1.name, product_init_1.create_user_id, product_init_1.price, product_init_1.describe),
            new Product(product_init_2.id, product_init_2.name, product_init_2.create_user_id, product_init_2.price, product_init_2.describe)
        ]);

    const purchaseListService = new PurchaseListService(mockPurchaseListDAO as any);

    let json_result = await purchaseListService.getUserPurchaseList(1);
    expect(json_result).toEqual(
        [
            product_init_1.id, product_init_2.id
        ]
    );
})

