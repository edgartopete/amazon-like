//load  npm's
var mysql = require("mysql");
var inquirer = require("inquirer");

// create a db connection
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "@Rl7trou3",
    database: "bamazon_db"
});



connection.connect(function (err) {
    if (err) throw err;
    queryProducts();
});

function queryProducts() {

    connection.query("select * from products", function (err, res) {
        if (err) throw err;
        //transform to set the item_id value to the index colum of the console.table 
        const transformed = res.reduce((acc, { item_id, ...x }) => { acc[item_id] = x; return acc }, {});
        console.table(transformed)
        doWhat();
    });
}
function buyProduct(item, units) {

    connection.query("select * from products where item_id = ?", item, function (err, res) {
        if (err) throw err;
        //transform to set the item_id value to the index colum of the console.table 
        const transformed = res.reduce((acc, { item_id, ...x }) => { acc[item_id] = x; return acc }, {});
        console.table(transformed)
        var stock = parseInt(res[0].stock_quantity);
        if (stock > 0 && (stock - units) >= 0) {
            stock = stock - units;
            var sale = (res[0].price*units);
            console.log("Your total will be: "+sale);
            
            updateProduct(stock, item,sale);
        } else {
            console.log("Insufficient quantity!")
        }
    });
}
function updateProduct(stock, product,sale) {
    connection.query("update products set ? where ?", [{ stock_quantity: stock, product_sales: sale}, { item_id: product }], function (err, res) {
        if (err) throw err;
        queryProducts();
    });
}
function doWhat() {
    inquirer
        .prompt([
            {
                type: "list",
                message: "What you like to do:",
                choices: ["Buy", "Exit"],
                name: "option"
            }
        ])
        .then(function (input) {
            if (input.option === "Buy") {
                inquirer
                    .prompt([
                        {
                            type: "input",
                            message: "What porduct you what to buy?",
                            name: "product"
                        },
                        {
                            type: "input",
                            message: "How many units you what to buy?",
                            name: "units"
                        }
                    ]).then(function(input){
                        buyProduct(input.product, input.units);
                    })
                
            } else {
                connection.end();
                return
            }
        })
}