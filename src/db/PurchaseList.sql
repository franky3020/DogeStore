CREATE TABLE IF NOT EXISTS `PurchaseList` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `user_id` INT NOT NULL,
    `product_id` INT NOT NULL,
    `purchase_time` DATETIME ,
    PRIMARY KEY (`id`),
    CONSTRAINT `user_product_unique` UNIQUE (`user_id`,`product_id`),
    CONSTRAINT `fk_PurchaseList_user_id` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`),
    CONSTRAINT `fk_PurchaseList_product_id` FOREIGN KEY (`product_id`) REFERENCES `Products`(`id`)
)