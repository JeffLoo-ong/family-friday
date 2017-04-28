/**
 * Program: Family Friday
 * Desc: 	Create random groups of people to eat lunch with!
 * Author: 	Jeff Luong
 * Rev: 	1.0
 * Updated: 4/28/2017
 */


"use strict";

// Load libraries
var chalk       = require('chalk');		// Colorize output
var clear       = require('clear');		// Clears the screen		
var figlet      = require('figlet'); 	// ASCII Art from text
var inquirer    = require('inquirer');	// Prompts user for input
var fs          = require('fs');		// File reading and writing


// Module Variables
var m_employee_array 	= [];				// Stores m_list_name in an array
var m_list_name 		= 'eList.txt';		// File to load list of names from	
var m_total_people;							// Total people in the list_name
var m_time_to_wait 		= 500;				// Time to allow assignment of m_employee_array

// Program starts here!
initialize();


/*
 * Function: 	initialize()
 * Desc: 		Prepare the console and load employee list
 * Params: 		NA
 * Returns: 	NA
 * CalledBy: 	index.js
 * Calls: 		start();
 */
function initialize(){
	// Clean up the console screen
	clear();

	// Print program title
	console.log(
		chalk.blue(
			figlet.textSync('Fam Friday', { horizontalLayout: 'full'})
		)
	);

	console.log('Initializing employee list from ' + m_list_name + '...');

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
	}, m_time_to_wait);	
} // initialize()


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
					console.log('\n');
					return true;
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

	inquirer.prompt(questions).then(function(response) {

		// Add the employee to the list. We add an '\n' to keep them separated by newlines
		if(response.employee_name != 0){
			fs.appendFile(m_list_name, ('\n' + response.employee_name), function (err) {
			  if (err) {
			  	throw err;
			  }
			  else{
			  	m_employee_array.push(response.employee_name);
			  	console.log('Added ' + response.employee_name + ' to the list!\n\n\n\n\n');
			  	// Increment the total number of people
			  	m_total_people++;
			  }
			});
		}
		// Return to start menu
		start();
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
		// debug
		// console.log("total peeps: " + m_total_people);
		randomizeArray();
		// Determine group sizes
		// 5 is the default in case of uneven groups
		// 1 extra person = 2 groups of 3
		// 2 extra people = 2 groups of 3 + 4
		// 3 extra people = 2 groups of 4 
		// 4 extra people = 2 groups of 4 + 5
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
				// console.log("extra people: " + extraPeople);
				b_splitGroups = true;
			}
			groupSize = 5;
		}

		printGroups(groupSize, extraPeople, b_splitGroups);

	// Case 0: Not enough people to make groups
	} else {
		console.log("There are " + m_total_people+ " people, we need at least 6 friends to" +
			" make random groups!");
		start();
	}
} // generateGroups()

/*
 * Function: 	printGroups()
 * Desc: 		Print out the groups. We have 3 cases
 * 				Case 1: Minimal amount of people to separate (6 or 7)
 * 				Case 2: More than 7 people, requires split
 * 				Case 3: Evenly divisible amount of people
 * Params: 		i_groupSize, i_extraPeople, b_splitGroups
 * Returns: 	NA
 * CalledBy: 	generateGroups()
 * Calls: 		NA
 */
function printGroups(i_groupSize, i_extraPeople, b_splitGroups){
	var groupNum = 1;		// Initialize group numbers to 1
	var i = 0;				// Group iterator
	var t = 0;				// Employee array iterator

	// Hold the number of people in split groups
	var groupOneSize, groupTwoSize; 	
	// Number of total people to split up 
	var peopleOffset = (i_groupSize + i_extraPeople);

	// Set the divisible limit
	var limit;

	// Determine if we want to split the last 2 groups differently
	// Set up an offset to the total people if we do
	if(b_splitGroups && i_extraPeople){
		// Total number of PEOPLE
		limit = m_total_people - peopleOffset;
	} else{
		// Total number of GROUPS to print if no split needed
		limit = Math.floor(m_total_people / i_groupSize);
	}
	//debug
	// console.log("Limit: " + limit);

	// Case 1: MINIMAL AMOUNT OF PEOPLE needed to separate
	// Ex: 7 means you need to split into 3 + 4
	if(limit == 0){
		groupOneSize = Math.ceil(peopleOffset / 2);

		console.log("Group 1");
		for(t; t < groupOneSize; t++){
			console.log(m_employee_array[t]);
		}
		// Use m_total_people here since we want the remainder
		console.log("\nGroup 2");
		for(t; t < m_total_people; t++){
			console.log(m_employee_array[t]);
		}
	} 
	// Case 2: Uneven groups to split but more than 7
	else if (limit > 0 && b_splitGroups){
		// Store total groups to print before we split
		var totalGroups = (limit/i_groupSize);
		// Print up to that number of groups, leaving the odd split
		for(i; i < (totalGroups); i++){
			console.log("\nGroup " + groupNum);
			// Print out a full group
			for(var x =0; x < i_groupSize; x++) {
				console.log(m_employee_array[t]);
				t++;
			}
			groupNum++;
		}

		// At this point t is left at the iteration we want to continue
		groupOneSize = t + Math.ceil(peopleOffset / 2);
		console.log("\nGroup " + groupNum);
		for(t; t < groupOneSize; t++){
			console.log(m_employee_array[t]);
		}

		groupNum++;

		// Use m_total_people here since we want the remainder
		console.log("\nGroup " + groupNum);
		for(t; t < m_total_people; t++){
			console.log(m_employee_array[t]);
		}
	}
	// Case 3: Even groups to split
	else {
		for(i; i < limit; i++){
			console.log("\nGroup " + groupNum);
			for(var x = 0; x < i_groupSize; x++) {
				console.log(m_employee_array[t]);	// Use employee iterator
				t++;
			}
			groupNum++;
		}		
	}

	// Program end. Can add restart here if desired
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
	var m = m_total_people, t, i;

	// While there remain elements to shuffle...
	while (m) {
		// Pick a remaining element...
		i = Math.floor(Math.random() * m--);

		// And swap it with the current element.
		t = m_employee_array[m];
		m_employee_array[m] = m_employee_array[i];
		m_employee_array[i] = t;
	}

	// Debug
	// var x;
	// for(x = 0; x < m_total_people; x++){
	// 	console.log(m_employee_array[x]);
	// }

} // randomizeArray()