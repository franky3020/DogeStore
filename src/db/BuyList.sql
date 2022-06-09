CREATE TABLE IF NOT EXISTS `BuyList` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `user_id` INT NOT NULL,
    `product_id` INT NOT NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `fk_BuyList_user_id` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`),
    CONSTRAINT `fk_BuyList_product_id` FOREIGN KEY (`product_id`) REFERENCES `Products`(`id`)
)