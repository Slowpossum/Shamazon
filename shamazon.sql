DROP DATABASE IF EXISTS shamazon_db;

CREATE DATABASE shamazon_db;

USE shamazon_db;

CREATE TABLE products (
	item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(50) NOT NULL,
    department_name VARCHAR(30) NOT NULL,
    price DEC(20, 2) NOT NULL,
    stock_quantity INT,
    product_sales DEC(20, 2) DEFAULT 0,
    PRIMARY KEY (item_id)
);

CREATE TABLE departments (
	department_id INT AUTO_INCREMENT,
    department_name VARCHAR(30) NOT NULL UNIQUE,
    over_head_costs DEC(20, 2) DEFAULT 0,
    PRIMARY KEY (department_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Oyasumi Punpun, Vol 1", "Books", 15, 10), ("Oyasumi Punpun, Vol 2", "Books", 15, 10), ("12 Gallon Jar of Assorted Jellybeans", "Food", 20.50, 100), ("12000 Paperclips (Used)", "Office", 5, 2);

INSERT INTO departments (department_name, over_head_costs)
VALUES ("Books", 10000), ("Food", 20000), ("Office", 50000);

INSERT INTO departments (department_name, over_head_costs)
VALUES ("Books", 12);

-- SELECT * FROM departments;

-- SELECT d.department_id, d.department_name, d.over_head_costs, SUM(p.product_sales) AS product_sales,  product_sales - d.over_head_costs AS total_profit FROM departments AS d INNER JOIN products AS p ON p.department_name=d.department_name GROUP BY department_name;



-- UPDATE products
-- SET stock_quantity = 10
-- WHERE item_id = 1;

-- SELECT * FROM products WHERE stock_quantity < 5