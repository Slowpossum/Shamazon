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
        for (result of res) {
            console.log(`Item Id: ${result.item_id}`);
            console.log(`Product: ${result.product_name}`);
            console.log(`Price: $${result.price.toFixed(2)}`);
            console.log(`Stock: ${result.stock_quantity}\r\n`);
        }

        main();
    });
}

function lowInventory() {

}

function addInventory() {

}

function newProduct() {

}