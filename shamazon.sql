DROP DATABASE IF EXISTS shamazon_db;

CREATE DATABASE shamazon_db;

USE shamazon_db;

CREATE TABLE products (
	item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(50) NOT NULL,
    department_name VARCHAR(30),
    price DEC(20, 2) NOT NULL,
    stock_quantity INT,
    PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Oyasumi Punpun, Vol 1", "Books", 15, 10), ("Oyasumi Punpun, Vol 2", "Books", 15, 10), ("12 Gallon Jar of Assorted Jellybeans", "Food", 20.50, 100), ("12000 Paperclips (Used)", "Office", 5, 2);

SELECT * FROM products;

-- UPDATE products
-- SET stock_quantity = 10
-- WHERE item_id = 1;

-- SELECT * FROM products WHERE stock_quantity < 5