// @flow
'use strict';

import 'babel-polyfill';
import { scrapeDaily } from './dailyScrape';

scrapeDaily()
    .then((result) => {
        console.log('dones');
    }).catch((err) => {
        console.log('error', err);
    });

//COMPLAINTS CAN GET ADDED LATER IN THE DAY.
//IF I DO 7/3 to 7/4 EARLY ON THE MORNING OF 7/5, I MAY NOT GET ALL THE COMPLAINTS I'D GET
//DOING IT AT THE END OF THE DAY ON 7/5.

//Generate an object with the proper date variables based on today's date

//inspectionGrabber.js
//@param: post variable object
//load the search results page
//BAIL IF THERE ARE NO INSPECTIONS?
//Collect every complaint link in an array
//Deduplicate the array
//Pass each link through the below loop

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
//RETURN original inspection object untouched