import PurchaseListDAO from "../repositories/PurchaseListDAO";

export default class PurchaseListService {

    private purchaseListDAO: PurchaseListDAO;

    constructor(purchaseListDAO: PurchaseListDAO) {
        this.purchaseListDAO = purchaseListDAO;
    }

    async addProductToPurchaseList(user_id: number, product_id: number) {

        let nowUTCDate = new Date();
        await this.purchaseListDAO.insertProductToList(user_id, nowUTCDate, product_id)
    }

    async getUserPurchaseList(user_id: number): Promise<object> {

        let products = await this.purchaseListDAO.findUserPurchase(user_id);

        let products_json = JSON.parse(JSON.stringify(products));

        return products_json;

    }

    async checkUserhasProduct(user_id: number, product_id: number): Promise<boolean> {

        let products = await this.purchaseListDAO.findUserPurchase(user_id);

        if (products.length === 0) {
            return false;
        }


        for (let p of products) {
            if (p.id === product_id) {
                return true;
            }
        }

        return false;

    }
}
