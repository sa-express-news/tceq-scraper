// @flow

'use strict';

import { isString, extractIntegerFromString, fetchPage, isNullOrUndefined, convertKeysToUnderscores } from './utility';

export function parseComplaint(url: string) {
    return new Promise(async(resolve, reject) => {
        if (!isString(url)) {

            return reject('Non-string passed to complaintParser.js');
        } else {

            try {
                let page = await fetchPage(url);

                let complaint = {};

                //TrackingNumber is always the first item and is always there, so this is safe
                complaint.trackingNumber = extractIntegerFromString(page.getElementsByClassName('waciListTitle')[0].textContent);

                //Hold a list of complaint properties we want to assign
                let arrayOfProperties = [
                    'dateReceived',
                    'numberComplaining',
                    'status',
                    'statusDate',
                    'nature',
                    'frequency',
                    'duration',
                    'media',
                    'program',
                    'priority',
                    'effect',
                    'receivingWater',
                    'regulatedEntity',
                    'county'
                ];

                //Get the first table, which contains all but description, comment and action
                //Grab every span with a class of waciDetail Title

                let detailTitleSpans = page.getElementsByClassName('waciDetail')[0].getElementsByClassName('waciDetailTitle');

                //If this array is empty, there is not a complaint on the page - reject
                if (detailTitleSpans.length === 0) {
                    return reject('This page does not contain a complaint');
                }

                //Loop through array of properties

                arrayOfProperties.forEach((property, index) => {
                    //If span[index]'s parent tr has an element with class waciListValue...
                    if (hasValue(detailTitleSpans[index])) {

                        let value = detailTitleSpans[index].parentElement.parentElement.getElementsByClassName('waciListValue')[0].textContent;

                        //If the title for the data includes 'Date'...
                        if (detailTitleSpans[index].textContent.indexOf('Date') > -1) {
                            //Create a date from the string, instead of using just the string
                            value = new Date(value);
                        }
                        //If the title for the data includes 'Number'...
                        else if (detailTitleSpans[index].textContent.indexOf('Number') > -1) {
                            //Create a number from the string, instead of using just the string
                            value = parseInt(value);
                        } else {
                            //It's a string, so we trim ugly whitespace
                            value = value.replace(/\s\s+/g, ' ').trim();
                        }
                        //Assign complaint[array[index]] to waciListValue value   
                        complaint[arrayOfProperties[index]] = value;
                    }
                    //Otherwise...
                    else {
                        //Assign empty string to that property
                        complaint[arrayOfProperties[index]] = '';
                    }

                    function hasValue(element) {
                        return element.parentElement.parentElement.getElementsByClassName('waciListValue').length > 0;
                    }
                });

                //Get the other three tables, which contain the final three properties we want

                let lastTables = Object.values(page.getElementsByClassName('waciDetail')).slice(1);



                //Create an array of the final three properties we're going to set

                let lastProperties = ['description', 'comment', 'actionTaken'];

                lastTables.forEach((table, index) => {
                    //If the table contains a value...
                    if (table.getElementsByClassName('waciListValue').length > 0) {
                        //Get the property
                        let value = table.getElementsByClassName('waciListValue')[0].textContent;
                        //Set the property, trimming whitespace
                        complaint[lastProperties[index]] = value.replace(/\s\s+/g, ' ').trim();
                    }
                    //Otherwise...
                    else {
                        complaint[lastProperties[index]] = '';
                    }
                })


                return resolve(complaint);

                //     const properties = Object.entries(complaint);

                //     if (properties.some(isNullOrUndefined)) {
                //         return reject('Scraper pulled null or undefined data');
                //     }


            } catch (e) {
                return reject(`Failure in parseComplaint: ${e}`);
            }

        }
    });
}