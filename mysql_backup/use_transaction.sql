use testDatabase_order;
SET autocommit = OFF;

START TRANSACTION;

SAVEPOINT savepoint_name;

SELECT @order_id:=id AS id FROM testDatabase_order.`Order`;

SET @next_order_id := @order_id + 20;

INSERT INTO `testDatabase_order`.`Order`
(`id`,
`user_id`,
`total_money`)
VALUES
(@next_order_id,
1,
100);

INSERT INTO `testDatabase_order`.`Order`
(
`user_id`,
`total_money`)
VALUES
(
1,
100);

 
ROLLBACK TO SAVEPOINT savepoint_name;
RELEASE SAVEPOINT savepoint_name;

COMMIT;
SET autocommit = ON;  





