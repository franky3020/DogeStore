CREATE TABLE IF NOT EXISTS `Products` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255),
    `create_user_id` INT,
    `price` INT,
    `describe` TEXT,
    PRIMARY KEY (`id`),
    CONSTRAINT `fk_user_id` FOREIGN KEY (`create_user_id`) REFERENCES User(`id`)
)