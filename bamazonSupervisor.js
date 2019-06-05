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
    if (where){
    query ="select * from departments"
    }else{

        query = "select d.*, p.sales, (d.over_head_costs-p.sales) as result "+
                "FROM departments as d "+
                "inner join ("+
                "select department_name, sum(product_sales) as sales "+
                "from products group by department_name) p "+
                "on d.department_name= p.department_name;";

    }
    

    connection.query(query, function (err, res) {
        if (err) throw err;
        //transform to set the item_id value to the index colum of the console.table 
        const transformed = res.reduce((acc, { department_id, ...x }) => { acc[department_id] = x; return acc }, {});
        console.table(transformed);
        doWhat();
    });
}


function addProduct(values){
    console.log(values[3]);
    connection.query("insert into departments (department_name,over_head_costs) values (?,?)", 
    [
        values[0],
        values[1]
        
    ], function (err, res) {
        if (err) throw err;
        queryProducts(true);
    });
}
function doWhat() {
    inquirer
        .prompt([
            {
                type: "list",
                message: "What you like to do:",
                choices: [
                    'View Product Sales by Department',
                    'Create New Department',
                    'Exit'],
                name: 'option'


            }
        ])
        .then(function (input) {

            switch (input.option) {
                case "View Product Sales by Department":
                    queryProducts(false);
                    break;
               
                case "Create New Department":

                        inquirer
                        .prompt([
                            {
                                type: "input",
                                message: "Department Name:",
                                name: "name"
                            },
                            {
                                type: "input",
                                message: "Over Head  Cost?",
                                name: "ohCost"
                            }

                        ]).then(function(input){
                            var newDeparment = [input.name,input.ohCost]
                            addProduct(newDeparment);
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