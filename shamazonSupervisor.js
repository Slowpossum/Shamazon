var inquirer = require("inquirer");
var mysql = require("mysql");
var table = require("console.table");

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
            name: 'supervisorList',
            message: 'Please choose an option.',
            choices: ["View Product Sales By Department", "Create New Department", "Exit"]
        }
    ]).then(function (user) {
        if (user.supervisorList === "View Product Sales By Department") {
            viewDept();
        } else if (user.supervisorList === "Create New Department") {
            createDept();
        } else {
            connection.end();
        }
    });
}

function viewDept() {
    connection.query(`SELECT d.department_id, d.department_name, d.over_head_costs, COALESCE(SUM(p.product_sales), 0) AS product_sales,  COALESCE(product_sales - d.over_head_costs, 0) AS total_profit 
    FROM departments AS d 
    LEFT JOIN products AS p 
    ON p.department_name=d.department_name 
    GROUP BY department_name`,
        function (err, res) {
            if (err) throw err;

            console.table(res);
            console.log("");
            main();
        });
}

function createDept() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'deptName',
            message: "Please enter a department name. (50 character limit)"
        },
        {
            type: 'input',
            name: "overhead",
            message: "Please enter a department overhead cost. (optional)"
        }
    ]).then(function (user) {
        if (user.deptName && user.deptName.length < 50) {
            connection.query(`INSERT INTO departments (department_name, over_head_costs)
            VALUES ("${user.deptName}", ${parseFloat(user.overhead).toFixed(2) || 0})`, function (err, res) {
                    if (err) {
                        if (err.code === "ER_DUP_ENTRY") {
                            console.log("\r\nDepartment already exists.\r\n");
                            return main();
                        } else {
                            throw err;
                        }
                    }

                    console.log("\r\nDepartment created.\r\n");
                    main();
                });
        } else {
            console.log("\r\nPlease enter a valid department name under 50 characters.\r\n");
            main();
        }
    });
}