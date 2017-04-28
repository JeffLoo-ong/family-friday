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
var employee_list = [];
var Spinner     = CLI.Spinner;			// Spinner art

// Clean up the console screen
clear();

// Print program title
console.log(
	chalk.blue(
		figlet.textSync('Fam Friday', { horizontalLayout: 'full'})
	)
);


console.log('Initializing employee list...');

// Load employee list from eList.txt
fs.readFile('eList.txt', function(err, data) {
    if(err){
    	throw err;	
    } 
    var array = data.toString().split("\n");
    
    var i = 0;
    for(i; i < array.length; i++) {
        employee_list.push(array[i]);
    }
});


// Set a timeout to allow above data to be set
setTimeout(function(){ 
	console.log("Done!");
	start();
}, 500);



function start() {
	var questions = [
		{
			name: 'option',
			type: 'input',
			message: 'What would you like to do?\n' +
			'    1)Add an employee\n' +
			'    2)Generate random lunch groups\n',
			validate: function (value) {
				if(value == 1 || value == 2) {
					return true;
				} else {
					return 'Please enter \'1\' or \'2\'';
				}
			}
		}
	];
	inquirer.prompt(questions)
}


// Add user to the list
// 
// Randomize the array order
// 
// Determine what groups to use (3/4/5)
// 
// Print out groups