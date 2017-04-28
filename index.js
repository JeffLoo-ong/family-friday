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
var m_employee_array 	= [];				// Stores m_list_name in an array
var m_Spinner     		= CLI.Spinner;		// Spinner art
var m_list_name 		= 'eList.txt';		// File to load list of names from	
var m_total_people;							// Total people in the list_name

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
	        m_employee_array.push(array[i]);
	    }
	});

	// NOTE: Decision here to create a small time out since array would not be filled immediately 
	// Set a timeout to allow above data to be set
	setTimeout(function(){ 
		console.log("Done!");
		// Set total number of people here so we don't have to call m_employee_array.length
		// multiple times 
		m_total_people = m_employee_array.length;
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
					return 'Please enter \'1\',\'2\' or \'3\'';
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
 * Calls: 		start()
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

		  	// Increment the total number of people
		  	m_total_people++;
		  	
		  	start();
		  }
		});
	});
} // addEmployee()

/*
 * Function: 	generateGroups()
 * Desc: 		Sort the list into groups
 * Params: 		NA
 * Returns: 	NA
 * CalledBy: 	start()
 * Calls: 		randomizeArray(), printGroups()
 */
function generateGroups(){
	var groupSize; 				// Hold the size of the groups to create
	var b_splitGroups = false;	// Boolean to split groups or not.
	var extraPeople;			// Number of extras not in groups
	
	// Only randomize if we have more than 5 people
	// Prevent printing groups if we don't have at least 2 groups of 3
	if(m_total_people > 5) {
		randomizeArray();
		// Determine group sizes
		// 5 is the default in case of uneven groups
		// 1 extra person = 2 groups of 3
		// 2 extra people = groups of 3 + 4
		// 3 extra people = 2 groups of 4 
		if(m_total_people % 3 == 0) {
			groupSize = 3;
		}
		else if (m_total_people % 4 == 0){
			groupSize = 4;
		}
		else {
			if(m_total_people % 5 != 0){
				extraPeople = m_total_people % 5;
				// debug
				console.log("extra people: " + extraPeople);
				b_splitGroups = true;
			}
			groupSize = 5;
		}

		printGroups(groupSize, extraPeople, b_splitGroups);
	} else {
		console.log("There are " + m_total_people+ " people, we need at least 6 friends to" +
			" make random groups!");
		start();
	}
} // generateGroups()

/*
 * Function: 	printGroups()
 * Desc: 		Print out the groups
 * Params: 		i_groupSize, i_extraPeople, b_splitGroups
 * Returns: 	NA
 * CalledBy: 	generateGroups()
 * Calls: 		NA
 */
function printGroups(i_groupSize, i_extraPeople, b_splitGroups){
	var groupNum = 1;		// Initialize group numbers to 1
	
	// Set the divisible limit to not include the extra peoplea and the last group
	var limit = m_total_people -(i_groupSize + i_extraPeople);

	// TODO: Latest point, fix me soon.
	console.log("Done for now!");
	return -1;

} // printGroups()

/*
 * Function: 	randomizeArray()
 * Desc: 		Randomize the m_employee_array using 
 * 				Fisher-Yates shuffle
 * Params: 		NA
 * Returns: 	NA
 * CalledBy: 	generateGroups()
 */
function randomizeArray(){
	var m = m_employee_array.length, t, i;

	// While there remain elements to shuffle…
	while (m) {
		// Pick a remaining element…
		i = Math.floor(Math.random() * m--);

		// And swap it with the current element.
		t = m_employee_array[m];
		m_employee_array[m] = m_employee_array[i];
		m_employee_array[i] = t;
	}

	// Debug
	// var x;
	// for(x = 0; x < m_employee_array.length; x++){
	// 	console.log(m_employee_array[x]);
	// }

} // randomizeArray()


// Print out groups