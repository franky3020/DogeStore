CREATE TABLE IF NOT EXISTS `Order` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `user_id` INT,
    `create_time` DATETIME ,
    `total_money` INT,
    PRIMARY KEY (`id`),
    CONSTRAINT `fk_Order_user_id` FOREIGN KEY (`user_id`) REFERENCES User(`id`)
)