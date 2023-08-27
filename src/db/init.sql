CREATE TABLE IF NOT EXISTS `User` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(255),
    `nickname` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `user_email_unique` UNIQUE (`email`)
);

CREATE TABLE IF NOT EXISTS `Products` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255),
    `create_user_id` INT,
    `price` INT,
    `describe` TEXT,
    PRIMARY KEY (`id`),
    CONSTRAINT `fk_user_id` FOREIGN KEY (`create_user_id`) REFERENCES `User`(`id`)
);

CREATE TABLE IF NOT EXISTS `User_Favorite_Products` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `user_id` INT NOT NULL,
    `product_id` INT NOT NULL,
    `is_favorite` BOOLEAN NOT NULL,
    `update_time` DATETIME NOT NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `fk_favorite_user_id` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`),
    CONSTRAINT `fk_favorite_product_id` FOREIGN KEY (`product_id`) REFERENCES `Products`(`id`)
);

CREATE TABLE IF NOT EXISTS `PurchaseList` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `user_id` INT NOT NULL,
    `product_id` INT NOT NULL,
    `purchase_time` DATETIME,
    PRIMARY KEY (`id`),
    CONSTRAINT `user_product_unique` UNIQUE (`user_id`, `product_id`),
    CONSTRAINT `fk_PurchaseList_user_id` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`),
    CONSTRAINT `fk_PurchaseList_product_id` FOREIGN KEY (`product_id`) REFERENCES `Products`(`id`) ON DELETE CASCADE
);