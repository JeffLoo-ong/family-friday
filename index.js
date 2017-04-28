"use strict";

// Load libraries
var chalk       = require('chalk');		// Colorize output
var clear       = require('clear');		// Clears the screen
var CLI         = require('clui');				
var figlet      = require('figlet'); 	// ASCII Art from text
var inquirer    = require('inquirer');
var _           = require('lodash');
var touch       = require('touch');
var fs          = require('fs');


// Module Variables
var m_employee_list 	= [];				// Stores m_list_name in an array
var m_Spinner     	= CLI.Spinner;			// Spinner art
var m_list_name 		= 'eList.txt';		// File to load list of names from	


// Program starts here!
setup();





/*
 * Function: 	setUp()
 * Desc: 		Prepare the console and load employee list
 * Params: 		NA
 * Returns: 	NA
 * CalledBy: 	index.js
 */
function setup(){
	// Clean up the console screen
	clear();

	// Print program title
	console.log(
		chalk.blue(
			figlet.textSync('Fam Friday', { horizontalLayout: 'full'})
		)
	);


	console.log('Initializing employee list...');

	// Load employee list from m_list_name
	fs.readFile(m_list_name, function(err, data) {
	    if(err){
	    	throw err;	
	    } 
	    var array = data.toString().split("\n");
	    
	    var i = 0;
	    for(i; i < array.length; i++) {
	        m_employee_list.push(array[i]);
	    }
	});

	// NOTE: Decision here to create a small time out since array would not be filled immediately 
	// Set a timeout to allow above data to be set
	setTimeout(function(){ 
		console.log("Done!");
		start();
	}, 500);	
} // setup()


/*
 * Function: 	start()
 * Desc: 		Initialize the program workflow
 * Params: 		NA
 * Returns: 	NA
 * CalledBy: 	index.js
 * Calls: 		addEmployee(), generateGroups()
 */
function start() {
	var questions = [
		{
			name: 'option',
			type: 'input',
			message: 'What would you like to do?\n' +
			'    1)Add an employee\n' +
			'    2)Generate random lunch groups\n' +
			'    3)Exit\n',
			validate: function (value) {
				if(value == 1 || value == 2 || value == 3) {
					return true;
				} else {
					return 'Please enter \'1\' or \'2\'';
				}
			}
		}
	];
	// Determine workflow based on response
	inquirer.prompt(questions).then(function(response) {
		if (response.option == 1){
			addEmployee();
		}
		else if (response.option == 2){
			generateGroups();
		}
		else if (response.option == 3){
			console.log("Have a nice day!");
			return -1;
		}
		// Should not get here if validation works with Inquirer
		else {
			console.log("Error: Input Validation did not work.");
			return -1;
		}
	});
} // start()

/*
 * Function: 	addEmployee()
 * Desc: 		Append the employee to list of employees
 * Params: 		NA
 * Returns: 	NA
 * CalledBy: 	start()
 */
function addEmployee(){
	
	var questions = [
		{
			name: 'employee_name',
			type: 'input',
			message: 'Please enter the name of the employee you wish to add: (0 to cancel)',
			validate: function (value) {
				// Go back to intial questions if cancelled
				if(value == 0) {
					start();
				} 
				// Any value except '0' is valid!
				else if (value){
					return true;
				}
				// In case of blanks
				else {
					return 'Please enter a name to add!';
				}
			}
		}
	];
	
	// TODO: Add confirm validation if time alotted
	// inquirer.prompt(questions).then(function(response) {
	// 	console.log("Is " + response.employee_name + "correct?");
	// });

	inquirer.prompt(questions).then(function(response) {

		// Add the employee to the list. We add an '\n' to keep them separated by newlines
		fs.appendFile(m_list_name, ('\n' + response.employee_name), function (err) {
		  if (err) {
		  	throw err;
		  }
		  else{
		  	console.log('Added ' + response.employee_name + ' to the list!');
		  	start();
		  }
		});
	});
} // addEmployee()


// Randomize the array order
// 
// Determine what groups to use (3/4/5)
// 
// Print out groups