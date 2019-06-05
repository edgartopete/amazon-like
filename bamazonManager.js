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
    //queryProducts();
});

function queryProducts(where) {
    if (!where)
        query = "select * from products";
    else
        query = "select * from products where stock_quantity>=5";

    connection.query(query, function (err, res) {
        if (err) throw err;
        //transform to set the item_id value to the index colum of the console.table 
        const transformed = res.reduce((acc, { item_id, ...x }) => { acc[item_id] = x; return acc }, {});
        console.table(transformed)
        doWhat();
    });
}

function addInventory(item, units) {
    connection.query("select * from products where item_id = ?", item, function (err, res) {
        if (err) throw err;
        //transform to set the item_id value to the index colum of the console.table 
        const transformed = res.reduce((acc, { item_id, ...x }) => { acc[item_id] = x; return acc }, {});
        console.table(transformed)
        var stock = parseInt(res[0].stock_quantity)+parseInt(units);
       
       updateProduct(stock, item);
       
    });
}
function updateProduct(stock, product) {
    connection.query("update products set ? where ?", [{ stock_quantity: stock }, { item_id: product }], function (err, res) {
        if (err) throw err;
        queryProducts(false);
    });
}

function addProduct(values){
    console.log(values[3]);
    connection.query("insert into products (product_name,department_name,price,stock_quantity) values (?,?,?,?)", 
    [
        values[0],
        values[1],
        values[2],
        values[3]
        
    ], function (err, res) {
        if (err) throw err;
        queryProducts(false);
    });
}
function doWhat() {
    inquirer
        .prompt([
            {
                type: "list",
                message: "What you like to do:",
                choices: [
                    'View Products for Sale',
                    'View Low Inventory',
                    'Add to Inventory',
                    'Add New Product',
                    'Exit'],
                name: 'option'


            }
        ])
        .then(function (input) {

            switch (input.option) {
                case "View Products for Sale":
                    queryProducts(false);
                    break;
                case "View Low Inventory":
                    queryProducts(true);
                    break;
                case "Add to Inventory":
                        inquirer
                        .prompt([
                            {
                                type: "input",
                                message: "What product you will like to incress the stock?",
                                name: "product"
                            },
                            {
                                type: "input",
                                message: "How many units you what to add?",
                                name: "units"
                            }
                        ]).then(function(input){
                            addInventory(input.product, input.units);
                        })
                    break;
                case "Add New Product":

                        inquirer
                        .prompt([
                            {
                                type: "input",
                                message: "Prodcut Name:",
                                name: "name"
                            },
                            {
                                type: "input",
                                message: "Department Name?",
                                name: "department"
                            },
                            {
                                type: "input",
                                message: "Price?",
                                name: "price"
                            },
                            {
                                type: "input",
                                message: "Initial Stock?",
                                name: "stock"
                            },

                        ]).then(function(input){
                            var newProduct = [input.name,input.department,input.price,input.stock]
                            addProduct(newProduct);
                        })
                    
                    break;

                default:
                    connection.end();
                    return;
                    break;
            }

        })
}

doWhat();