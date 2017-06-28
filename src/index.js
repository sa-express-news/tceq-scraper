// @flow
'use strict';

//





//inspectionParser.js
	//@param: string url
	//Load the inspection page
	//Parse complaint number, status, description, etc.
	//RETURN inspection object with all relevant information

//database.js
	//@param: inspection object
	//Create a new object with database-table property forms (ie propertyOne becomes property_one)
	//Insert the object into the database
	//RETURN original inspection object untouched

//mailer.js
	//@param: inspection object
	//Create a pretty-printed string of the object
	//Email the string to the relevant recipients
	
