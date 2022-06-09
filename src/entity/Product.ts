class Product {

    id: number | null; // Todo: 要檢查這利用 null 好不好
    name: string;
    create_user_id: number;
    price: number;
    describe: string;
    photos: string[];// 描述產品本身的照片, 展示的縮圖 未來可加

    constructor(id: number | null, name: string, create_user_id: number, price: number, describe: string, photos?: string[]) {
        this.name = name;
        this.create_user_id = create_user_id;
        this.price = price;
        this.describe = describe;


        this.id = id;

        if (photos) {
            this.photos = photos;
        } else {
            this.photos = new Array(); // Lazy initialization
        }

    }

    toString(): string {

        let outStr = "";

        if (this.id) {
            let idNum = this.id as number;
            outStr += "id: " + idNum.toString() + '\n';
        }


        let nameStr: string = "name: " + this.name + "\n";
        outStr += nameStr;

        let priceStr: string = "price: " + this.price + "\n";
        outStr += priceStr;

        let describeStr: string = "describe: " + this.describe + "\n";
        outStr += describeStr;

        let photosStr: string = "photos: [ ";
        for (const [index, photo] of this.photos.entries()) { // photos: [ 1_URL, 2_URL ]
            if (index === 0) {
                photosStr += photo;
                continue;
            }
            photosStr += ', ' + photo;
        }
        photosStr += " ]\n";
        outStr += photosStr;




        return outStr;

    }

}

export default Product;