
import ProductDAO from "../repositories/ProductDAO";
import Product from "../entity/Product";
import fs from "fs";
import path from "path";

export default class ProductService {

    private productDAO: ProductDAO;

    static readonly SAVE_PRODUCT_IMAGES_PATH = path.join(__dirname, "/../../public/productImg");
    static readonly SAVE_PRODUCT_ZIP_FILE_PATH = path.join(__dirname, "/../../product_zip");
    static readonly PRODUCT_ZIP_FILE_NAME = "product.zip";
    static readonly PRODUCT_IMG_FILE_NAME = "product_publicimg.png";

    constructor(productDAO: ProductDAO) {
        this.productDAO = productDAO;
    }

    // Todo photos?: string[] 應該不需要
    async addProduct(name: string, create_user_id: number, price: number, describe: string, photos?: string[]) {
        let product = new Product(null, name, create_user_id, price, describe, photos);
        await this.productDAO.create(product);
    }

    async addProductImg(product_id: number, imageFile: Buffer): Promise<void> {

        let saveDir = path.join(ProductService.SAVE_PRODUCT_IMAGES_PATH, product_id.toString());
            
        await fs.promises.mkdir(saveDir).catch(()=>{
            // ignore
        });


        let filePath = path.join(saveDir, ProductService.PRODUCT_IMG_FILE_NAME);
        await fs.promises.writeFile(filePath, imageFile);

    }

    deleteProductImg(product_id: number): Promise<any> {
        let saveDir = path.join(ProductService.SAVE_PRODUCT_IMAGES_PATH, product_id.toString());
        return fs.promises.rm(saveDir, {recursive: true});
    }

    // Add in (SAVE_PRODUCT_ZIP_FILE_PATH /:id/product.zip)
    async addProductZipFile(product_id: number, zipFile: Buffer): Promise<void> {

        let saveDir = path.join(ProductService.SAVE_PRODUCT_ZIP_FILE_PATH, product_id.toString());
            
        await fs.promises.mkdir(saveDir).catch(()=>{
            // ignore
        });

        let fileName = ProductService.PRODUCT_ZIP_FILE_NAME;
        let filePath = path.join(saveDir, fileName);

        await fs.promises.writeFile(filePath, zipFile);
    }

    // Get path like (SAVE_PRODUCT_ZIP_FILE_PATH /:id/product.zip)
    getProductZipFilePath(product_id: number): string {
        let fileName = ProductService.PRODUCT_ZIP_FILE_NAME;
        let productZipFilePath = path.join(ProductService.SAVE_PRODUCT_ZIP_FILE_PATH, product_id.toString(), fileName);
        return productZipFilePath;
    }

    deleteProductZipFile(product_id: number): Promise<any> {
        let saveDir = path.join(ProductService.SAVE_PRODUCT_ZIP_FILE_PATH, product_id.toString());
        return fs.promises.rm(saveDir, {recursive: true});
    }


    async findProductById(id: number): Promise<object> {

        let product: Product | null = await this.productDAO.findById(id);

        let product_json = {};
        if (product) {
            product_json = JSON.parse(JSON.stringify(product));
        }

        return product_json;
    }

    async findAllProduct(): Promise<[]> {
        let products: Product[] = await this.productDAO.findAll();

        let products_json = JSON.parse(JSON.stringify(products));
        return products_json;
    }

    async deleteProductById(id: number): Promise<void> {
        await this.productDAO.deleteById(id);

        this.deleteProductImg(id).catch(()=>{
            // ignore
        })

        this.deleteProductZipFile(id).catch(()=>{
            // ignore
        })
    }


}