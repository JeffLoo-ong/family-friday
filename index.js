/**
 * Program: Family Friday
 * Desc: 	Create random groups of people to eat lunch with!
 * Author: 	Jeff Luong
 * Rev: 	1.0.2
 * Updated: 5/09/2017
 */


"use strict";

// Load 3rd party libraries
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
var m_group_num			= 1;				// Group number counter
var m_group_it			= 0;				// Group name iterator

// Program starts here!
initialize();

/*
 * Function: 	initialize()
 * Desc: 		Starter function
 * Param: 		NA
 * Returns: 	NA
 * CalledBy: 	index.js
 * Calls: 		printTitle(), loadFile()
 */
function initialize(){
	printTitle();
	loadFile();
} // initialize()

/*
 * Function: 	removeEmployee()
 * Desc: 		Removes an employee from the list who is sick
 * 				or on PTO!
 * Param: 		NA
 * Returns: 	NA
 * CalledBy: 	showMenu()
 * Calls: 		showMenu()
 */
function removeEmployee() {
	var questions = [
		{
			name: 'employeeName',
			type: 'input',
			message: 'Enter an employee to exclude from the lunch groups:\n',
			validate: function (employeeName) {
				if(employeeName == ''){
					return console.log('\nPlease enter a name\n');
				} 
				else {
					return true;
				}
			}
		}
	];

	inquirer.prompt(questions).then(function(response) {
		var index = m_employee_array.indexOf(response.employeeName);
		if(index !== -1) {
			// Delete one instance of that name
			m_employee_array.splice(index, 1);
			console.log("Successfully removed " + response.employeeName + "!");
			
			//Reduce people count
			m_total_people--;

		} else {
			console.log(response.employeeName + " was not found...");
		}
		showMenu();
	});
} // removeEmployees()

/*
 * Function: 	printTitle()
 * Desc: 		Clears the console and prints the title
 * Param: 		NA
 * Returns: 	NA
 * CalledBy: 	initialize()
 * Calls: 		NA
 */
function printTitle(){
	// Clean up the console screen
	clear();

	// Print program title
	console.log(
		chalk.blue(
			figlet.textSync('Fam Friday', { horizontalLayout: 'full'})
		)
	);
} // printTitle()

/*
 * Function: 	loadFile()
 * Desc: 		Gets the fileName from user (if any) and loads the list
 * Param: 		NA
 * Returns: 	NA
 * CalledBy: 	initialize()
 * Calls: 		NA
 */
function loadFile(){
	var questions = [
		{
			name: 'fileName',
			type: 'input',
			message: 'Enter a file to load, otherwise a default file (eList.txt) will be loaded\n',
			validate: function (fileName) {
				if(fileName.indexOf('.txt') > -1) {
					return true;
				} else if ( fileName == ''){
					return true;
				} else {
					return console.log('\nPlease enter a valid .txt file or blank\n');
				}
			}
		}
	];

	inquirer.prompt(questions).then(function(response) {
		// Set the file name to user input
		if(response.fileName != ''){
			m_list_name = response.fileName;
		} else {
			m_list_name = 'eList.txt';
		}

		console.log('Initializing employee list from ' + m_list_name + '...');
		// Load employee list from m_list_name
		fs.readFile(m_list_name, function(err, data) {
		    if(err){
		    	console.log("Error reading file: " + err);
		    	loadFile();
		    } else {
			    var array = data.toString().split("\n");
			    
			    var i = 0;
			    for(i; i < array.length; i++) {
			        m_employee_array.push(array[i]);
			    }

				m_total_people = m_employee_array.length;
				console.log("Done!");
				sortArray();
				showMenu();
		    }
		});
	});
} // loadFile()

/*
 * Function: 	sortArray()
 * Desc: 		Sorts the array in ascending order
 * 				if a < b return -1 to signify a < b
 * 				if a > b return 1 to signify a > b
 * 				return 0 if a == b 
 * Param: 		NA
 * Returns: 	NA
 * CalledBy: 	initialize()
 * Calls: 		NA
 */
function sortArray(){
	m_employee_array.sort(function(a, b){
		var x = a.toLowerCase();
		var y = b.toLowerCase();
		// Sorting in ascending order
		if(x < y) {
			return -1;
		}
		if (x > y) {
			return 1;
		}
		return 0;
	});
} // sortArray()

/*
 * Function: 	showMenu()
 * Desc: 		Initialize the program workflow
 * Param: 		NA
 * Returns: 	NA
 * CalledBy: 	index.js
 * Calls: 		addEmployee(), generateGroups()
 */
function showMenu() {
	var questions = [
		{
			name: 'option',
			type: 'input',
			message: 'What would you like to do?\n' +
			'    1)Add an employee\n' +
			'    2)Generate random lunch groups\n' +
			'    3)Remove an employee\n' +
			'    4)Exit\n',
			validate: function (value) {
				if(value == 1 || value == 2 || value == 3 || value == 4) {
					return true;
				} else {
					return 'Please enter \'1\',\'2\',\'3\'  or \'4\'';
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
			removeEmployee();
		}
		else if (response.option == 4){
			console.log("Have a nice day!");
			return -1;
		}
		// Should not get here if validation works with Inquirer
		else {
			console.log("Error: Input Validation did not work.");
			return -1;
		}
	});
} // showMenu()

/*
 * Function: 	addEmployee()
 * Desc: 		Append the employee to list of employees
 * Param: 		NA
 * Returns: 	NA
 * CalledBy: 	showMenu()
 * Calls: 		showMenu()
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
		// Return to showMenu menu
		showMenu();
	});
} // addEmployee()

/*
 * Function: 	generateGroups()
 * Desc: 		Sort the list into groups
 * Param: 		NA
 * Returns: 	NA
 * CalledBy: 	showMenu()
 * Calls: 		randomizeArray(), printGroups(), showMenu()
 */
function generateGroups(){
	var groupSize; 				// Hold the size of the groups to create
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
			}
			groupSize = 5;
		}

		printGroups(groupSize, extraPeople);

	// Case 0: Not enough people to make groups
	} else {
		console.log("There are " + m_total_people + " people, we need at least 6 friends to" +
			" make random groups!");
		showMenu();
	}
} // generateGroups()

/*
 * Function: 	printGroups()
 * Desc: 		Print out the groups. We have 3 cases
 * 				Case 1: Minimal amount of people to separate (6 or 7)
 * 				Case 2: More than 7 people, requires split
 * 				Case 3: Evenly divisible amount of people
 * Param: 		i_groupSize - Number of people per group
 * Param: 		i_extraPeople - Extra people that don't fit the determined group size
 * Returns: 	NA
 * CalledBy: 	generateGroups()
 * Calls: 		NA
 */
function printGroups(i_groupSize, i_extraPeople){
	m_group_num = 1;		// Reset the group number to 1	
	m_group_it 	= 0;		// Reset the group iterator to 0;
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
	if(i_extraPeople){
		// Total number of PEOPLE
		limit = m_total_people - peopleOffset;
	} else{
		// Total number of GROUPS to print if no split needed
		limit = Math.floor(m_total_people / i_groupSize);
	}
	//debug
	// console.log("Limit: " + limit);

	// Case 1: MINIMAL AMOUNT OF PEOPLE(7) needed to separate
	if(limit == 0){
		printTwoGroups(peopleOffset);
	} 
	// Case 2: Uneven groups to split but more than 7 people
	else if (limit > 0 && i_extraPeople){
		// Store total groups to print before we split
		var totalGroups = (limit/i_groupSize);
		
		// Print up to that number of groups, leaving the odd split
		for(i; i < (totalGroups); i++){
			printGroupNames(i_groupSize, 1);
		}

		// Print remainder of group
		printTwoGroups(peopleOffset);
	}
	// Case 3: Even groups to split
	else {
		printGroupNames(i_groupSize, limit);	
	}

	// Go back to the menu
	showMenu();
} // printGroups()

/*
 * Function: 	randomizeArray()
 * Desc: 		Randomize the m_employee_array using 
 * 				Fisher-Yates shuffle
 * Param: 		NA
 * Returns: 	NA
 * CalledBy: 	generateGroups()
 * Calls: 		NA
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

/*
 * Function: 	printGroupNames()
 * Desc: 		Prints the group number
 * Param: 		i_groupSize - Size of group to print
 * Param: 		i_groupsToPrint - Number of groups to print
 * Returns: 	NA
 * CalledBy: 	printGroups()
 * Calls: 		NA
 */
function printGroupNames(i_groupSize, i_groupsToPrint){
	for(var x = 0; x < i_groupsToPrint; x++){
		console.log('\n');
		console.log("Group " + m_group_num);
		for(var y = 0; y < i_groupSize; y++){
			console.log(m_employee_array[m_group_it]);
			m_group_it++;
		}
		m_group_num++;
	}
} // printGroupNames()

/*
 * Function: 	printTwoGroups()
 * Desc: 		Prints the two remaining groups by splitting
 * Param: 		i_peopleOffset - Number of people left to group
 * Returns: 	NA
 * CalledBy: 	printGroups()
 * Calls: 		NA
 */
function printTwoGroups(i_peopleOffset) {
	var groupOneSize, groupTwoSize;

	// Group One will be bigger and group two will be the rest
	groupOneSize = Math.ceil(i_peopleOffset / 2);
	groupTwoSize = (i_peopleOffset - groupOneSize);

	printGroupNames(groupOneSize, 1);
	printGroupNames(groupTwoSize, 1);
} // printTwoGroups()