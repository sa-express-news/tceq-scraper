// @flow
'use strict';

import 'babel-polyfill';

import { sendMail } from './mailer';
import { grabInspections } from './inspectionGrabber';
import { createRequestObject } from './utility';

require('dotenv').config();

// let inspectionObject = {
//     trackingNumber: 1555,
//     dateReceived: new Date(),
//     numberComplaining: 1,
//     status: 'Good',
//     statusDate: new Date(),
//     nature: 'foo',
//     frequency: 'foo',
//     duration: 'foo',
//     media: 'foo',
//     program: 'foo',
//     priority: 'foo',
//     effect: 'foo',
//     receivingWater: 'foo',
//     regulatedEntity: 'foo',
//     county: 'foo',
//     description: 'foo',
//     comment: 'foo',
//     actionTaken: 'foo'
// };

// let inspectionObject2 = {
//     trackingNumber: 1556,
//     dateReceived: new Date(),
//     numberComplaining: 1,
//     status: 'Good',
//     statusDate: new Date(),
//     nature: 'foo',
//     frequency: 'foo',
//     duration: 'foo',
//     media: 'foo',
//     program: 'foo',
//     priority: 'foo',
//     effect: 'foo',
//     receivingWater: 'foo',
//     regulatedEntity: 'foo',
//     county: 'foo',
//     description: 'foo',
//     comment: 'foo',
//     actionTaken: 'foo'
// };

// const arrayOfInspections = [inspectionObject, inspectionObject2];
// const emailRecipients = process.env.EMAIL_RECIPIENTS.split(',');

// sendMail(arrayOfInspections, emailRecipients)
//     .then((result) => {
//         console.log('email sent');
//     });



// //Object with parameters to send to the search form
// let requestObject = createRequestObject(new Date('6/6/17'));




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
