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
    connection.query('SELECT * FROM products', function (err, res) {
        if (err) throw err;

        for (result of res) {
            console.log(`Item Id: ${result.item_id}`);
            console.log(`Product: ${result.product_name}`);
            console.log(`Price: $${result.price.toFixed(2)}`);
            console.log(`Stock: ${result.stock_quantity}\r\n`);
        }

        inquirer.prompt([
            {
                type: 'input',
                name: 'itemId',
                message: 'Please enter the ID of the item you would like to purchase.'
            },
            {
                type: 'input',
                name: 'quantity',
                message: 'Please enter the quantity that you would like to purchase.'
            }
        ]).then(function (user) {
            if (parseInt(user.itemId)) {
                if (parseInt(user.quantity)) {
                    purchase(user.itemId, user.quantity);
                } else {
                    console.log("\r\nPlease enter a valid quantity.\r\n");
                    continueQuit();
                }
            } else {
                console.log("\r\nPlease enter a valid item ID.\r\n");
                continueQuit();
            }
        });
    });
}

function purchase(id, quantity) {
    connection.query(`SELECT * FROM products WHERE item_id = ${id}`, function (err, res) {
        if (err) throw err;

        if (res[0].stock_quantity > quantity) {
            console.log(`\r\nItem purchased: "${res[0].product_name}" x ${quantity}: $${(res[0].price * quantity).toFixed(2)}\r\n`);
            connection.query(`UPDATE products SET stock_quantity = ${res[0].stock_quantity - quantity} WHERE item_id = ${id}`, function (err, res) {
                if (err) throw err;
                continueQuit();
            });
        } else {
            console.log(`\r\nThere's an insufficient quantity of "${res[0].product_name}."\r\n`);
            continueQuit();
        }
    });
}

function continueQuit() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'continueQuit',
            message: "Would you like to make another purchase?",
            choices: ['yes', 'no']
        }
    ]).then(function (user) {
        if (user.continueQuit === 'yes') {
            main();
        } else {
            connection.end();
        }
    });
}