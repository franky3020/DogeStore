CREATE TABLE IF NOT EXISTS `Order` (
    `uuid` VARCHAR(36) NOT NULL,
    `user_id` INT,
    `create_time` DATETIME ,
    `total_money` INT,
    PRIMARY KEY (`uuid`),
    CONSTRAINT `fk_Order_user_id` FOREIGN KEY (`user_id`) REFERENCES User(`id`)
)