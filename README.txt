Prerequisites: 
NodeJs installed
Files cloned

How To Run:
1) Open a command prompt and go into the directory with the files
2) Type 'node index.js' or 'nodejs index.js'(If using ubuntu. Program was 
	developed using Ubuntu 16.04)
3) Follow instructions in application.

-----------------------------------------------------------------------------------------  

Original Outline

How to initialize program?
- Load file with employee list
- Prompt user for decision to Add employee or generate random groups

How to store and read files?
- Use a file read and write system

How to add a user?
- Append to a file

How to generate groups? 
- Modulo array length of employees by 3, 4, and 5. 
- Edge cases will be
	- 0, 1,and 2 employee(s)
	- Leftover groups of 1 or 2 employees
		- Redistribute previous group to make this work
	- Spare groups of 3 or 4 (modulo 4 or 5)
		- Turn these into their own groups

How to display?
- Print table to console

-----------------------------------------------------------------------------------------
Changes from Original Outline
- New edge case added for 6 or 7 people. These are Minimum groups to separate.
- Leftover groups of employees can go up to 4 (Discovered once I decided 5 was going tobe  the number to use as max splitter)
- Use of variable 'limit' to represent both GROUPS and number of PEOPLE
- Decided against table for time

------------------------------------------------------------------------------------------
Potential upgrades
- Put functions into modules
- Allow users to select which file they want to load
- DRY up some code 
	- (Do we need b_splitGroups?)
	- Split groups printed potentially combined