class Product {

    name: string;
    price: number;
    describe: string;
    photos: string[];// 描述產品本身的照片, 展示的縮圖 未來可加

    constructor(name: string, price: number, describe: string, photos?: string[]) {
        this.name = name;
        this.price = price;
        this.describe = describe;

        if ( photos ) {
            this.photos = photos;
        } else {
            this.photos = new Array(); // Lazy initialization
        }

    }

    toString(): string {
        let nameStr: string = "name: " + this.name + "\n"; 
        let priceStr: string = "price: " + this.price + "\n"; 
        let describeStr: string = "describe: " + this.describe + "\n"; 

        let photosStr: string = "photos: [ ";
        for(const [index, photo] of this.photos.entries()) { // photos: [ 1_URL, 2_URL ]
            if ( index === 0 ) {
                photosStr += photo ;
                continue;
            } 
            photosStr += ', ' + photo ;
        }
        photosStr += " ]\n";

        return nameStr + priceStr + describeStr + photosStr;

    }

}

export default Product;