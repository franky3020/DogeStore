CREATE TABLE IF NOT EXISTS `Order_Product_jt` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `order_id` INT,
    `product_id` INT,
    PRIMARY KEY (`id`),
    CONSTRAINT `fk_Order_Product_jt_order_id` FOREIGN KEY (`order_id`) REFERENCES `Order`(`id`),
    CONSTRAINT `fk_Order_Product_jt_product_id` FOREIGN KEY (`product_id`) REFERENCES `Products`(`id`)
)