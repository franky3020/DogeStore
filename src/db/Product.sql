CREATE TABLE IF NOT EXISTS `Products` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255),
    `create_user_id` INT,
    `price` INT,
    `describe` TEXT,
    PRIMARY KEY (`id`)
)