use testDatabase_order;
SELECT * FROM testDatabase_order.Order_Product_jt;
SELECT * FROM testDatabase_order.Products;
SELECT * FROM testDatabase_order.`Order`;


SELECT DISTINCT Products.id FROM (`Order` INNER JOIN Order_Product_jt
ON `Order`.id = Order_Product_jt.order_id)
INNER JOIN Products ON Products.id = Order_Product_jt.product_id
WHERE `Order`.user_id = 1;

