//require packages 
var mysql = require("mysql");
var inquirer = require("inquirer");
var sleep = require('sleep');


//connection to the localhost
var connection = mysql.createConnection({
    host:"localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon"
})

//condition of the connection
connection.connect(function(error){
    if(error) throw error;
    //console.log("it works");
    displayShop();
})


//function to display table in the terminal
function displayShop(){
    connection.query("SELECT * FROM products", function(error, res){
        	console.log(" ");
        	console.log("============= Please Shop Responsibly =============")
        for( var i=0; i<res.length; i++){
            console.log(" ");
            console.log(res[i].itemid+ " - "+res[i].name+" - "+res[i].type+" - "+res[i].price+" - "+res[i].quantity+" ");
            
       	 }
        	console.log(" ");
        	console.log("============= Thank You For Shopping ==============")
    	})
}

//validade that user is only using numbers
function validateInput(value) {
	var integer = Number.isInteger(parseFloat(value));
	var sign = Math.sign(value);

	if (integer && (sign === 1)) {
		return true;
	} else {
		return 'Please type numbers only.';
	}
}
//prompt user to buy x item x amount of units.
inquirer.prompt([
    {
      type: "input",
	  name: "itemid",
      message: "Please, select an item ID number that you would like to buy?",
		validade: validateInput,
		filter: Number
       },
    {
      type: "input",
      name: "quantity",
      message: "How many units would you like?",
	  validade: validateInput,
	  filter: Number
	}

//this function will subtract the quantity of items the users buys from the quantity of item in our store.
]).then(function(answer){
	connection.query("SELECT * FROM products WHERE itemid = ?" , [answer.itemid], function(err, res){
		//and will cancel an order that surpaces the x amount of item available on the store.
		if(answer.quantity > res[0].quantity){
			console.log('Insufficient Quantity');
			console.log('Your order was cancelled');
			console.log('');
		} else {
			amountOwed = res[0].price * answer.quantity;
			type = res[0].type;
			console.log('Thanks for shopping with us');
			//it will also display the amount of money user owns the store.
			console.log('Your total is  $' + amountOwed);
			console.log('');
			//update the number of available items on the store
			connection.query('UPDATE products SET ? Where ?', [{
				quantity: res[0].quantity - answer.quantity
			},{
				itemid: answer.itemid
			}], function(error, res){});
			displayShop();
			sleep.sleep(3);
			
		}
	})
})
