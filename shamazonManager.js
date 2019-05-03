var inquirer = require("inquirer");
var mysql = require("mysql");

var connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",

    password: "",
    database: "shamazon_db"
});

connection.connect(function (err) {
    main();
});

function main() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'managerList',
            message: 'Please choose an option.',
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"]
        }
    ]).then(function (user) {
        switch (user.managerList) {
            case "View Products for Sale":
                viewProducts();
                break;
            case "View Low Inventory":
                lowInventory();
                break;
            case "Add to Inventory":
                addInventory();
                break;
            case "Add New Product":
                newProduct();
                break;
            case "Exit":
                connection.end();
                break;
        }
    });
}

function viewProducts() {
    connection.query('SELECT * FROM products', function (err, res) {
        if (err) throw err;

        for (result of res) {
            console.log(`Item Id: ${result.item_id}`);
            console.log(`Product: ${result.product_name}`);
            console.log(`Department: ${result.department_name}`);
            console.log(`Price: $${result.price.toFixed(2)}`);
            console.log(`Stock: ${result.stock_quantity}\r\n`);
        }

        main();
    });
}

function lowInventory() {
    connection.query('SELECT * FROM products WHERE stock_quantity < 5', function (err, res) {
        if (err) throw err;

        if (res.length === 0) {
            console.log("\r\nNo products currently have low inventories.\r\n");
        } else {
            for (result of res) {
                console.log(`Item Id: ${result.item_id}`);
                console.log(`Product: ${result.product_name}`);
                console.log(`Department: ${result.department_name}`);
                console.log(`Price: $${result.price.toFixed(2)}`);
                console.log(`Stock: ${result.stock_quantity}\r\n`);
            }
        }

        main();
    });
}

function addInventory() {
    connection.query('SELECT * FROM products', function (err, res) {
        if (err) throw err;

        var len = res.length;

        for (result of res) {
            console.log(`Item Id: ${result.item_id}`);
            console.log(`Product: ${result.product_name}`);
            console.log(`Department: ${result.department_name}`);
            console.log(`Price: $${result.price.toFixed(2)}`);
            console.log(`Stock: ${result.stock_quantity}\r\n`);
        }

        inquirer.prompt([
            {
                type: 'input',
                name: 'itemId',
                message: 'Please enter the ID of the item to restock.'
            },
            {
                type: 'input',
                name: 'quantity',
                message: 'Please enter an amount to add.'
            }
        ]).then(function (user) {
            if (parseInt(user.itemId)) {
                if (parseInt(user.quantity)) {
                    if (parseInt(user.itemId) <= len) {
                        connection.query(`UPDATE products SET stock_quantity = ${res[user.itemId - 1].stock_quantity + parseInt(user.quantity)} WHERE item_id = ${user.itemId}`, function (err, res) {
                            if (err) throw err;

                            console.log(`\r\nSuccessfully restocked.\r\n`);
                            main();

                        });
                    } else {
                        console.log("\r\nPlease enter the ID of an existing product.\r\n");
                        main();
                    }
                } else {
                    console.log("\r\nPlease enter a valid quantity.\r\n");
                    main();
                }
            } else {
                console.log("\r\nPlease enter a valid item ID.\r\n");
                main();
            }
        });
    });
}

function newProduct() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'productName',
            message: "Please enter the name of the product to add."
        },
        {
            type: 'input',
            name: 'department',
            message: "Please enter a department for the product."
        },
        {
            type: 'input',
            name: 'productPrice',
            message: "Please enter the price of the product to add."
        },
        {
            type: 'input',
            name: 'productStock',
            message: "Please enter the number of products to stock."
        }
    ]).then(function (user) {
        if (user.productName) {
            if (user.department) {
                if (parseInt(user.productPrice)) {
                    if (parseInt(user.productStock)) {
                        connection.query(`INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ("${user.productName}", "${user.department}", ${parseFloat(user.productPrice).toFixed(2)}, ${user.productStock})`, function (err, res) {
                            if (err) throw err;

                            console.log("\r\nProduct added.\r\n");
                            main();
                        });
                    } else {
                        console.log("\r\nPlease enter a valid stock amount.\r\n");
                        main();
                    }
                } else {
                    console.log("\r\nPlease enter a valid price.\r\n");
                    main();
                }
            } else {
                console.log("\r\nPlease enter a department.\r\n");
                main();
            }
        } else {
            console.log("\r\nPlease enter a product name.\r\n");
            main();
        }
    });
}