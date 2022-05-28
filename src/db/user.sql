CREATE TABLE IF NOT EXISTS `User` (
    `email` VARCHAR(255) NOT NULL,
    `nickname` VARCHAR(255),
    `password` VARCHAR(255),
    PRIMARY KEY (`email`)
)