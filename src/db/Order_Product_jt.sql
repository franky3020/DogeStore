CREATE TABLE IF NOT EXISTS `Order_Product_jt` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `order_uuid` VARCHAR(36) NOT NULL,
    `product_id` INT NOT NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `fk_Order_Product_jt_order_uuid` FOREIGN KEY (`order_uuid`) REFERENCES `Order`(`uuid`),
    CONSTRAINT `fk_Order_Product_jt_product_id` FOREIGN KEY (`product_id`) REFERENCES `Products`(`id`)
)