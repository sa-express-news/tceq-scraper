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

                const htmlCollection = page.getElementsByClassName('waciListValue');

                const values = Object.values(htmlCollection).map((element: any) => {
                    return element.textContent;
                });

                if (values.length === 0) {
                    return reject('Scraper pulled null or undefined data');
                }

                complaint.trackingNumber = extractIntegerFromString(page.getElementsByClassName('waciListTitle')[0].textContent);


                complaint.dateReceived = new Date(values[0]);

                complaint.numberComplaining = parseInt(values[1]);

                complaint.status = values[2];

                complaint.statusDate = new Date(values[3]);

                complaint.nature = values[4];

                complaint.frequency = values[5];

                complaint.duration = values[6];

                complaint.media = values[7];

                complaint.program = values[8].trim();

                complaint.priority = values[9].replace(/\s\s+/g, ' ');

                complaint.effect = values[10].replace(/\s\s+/g, ' ').trim();

                complaint.receivingWater = values[11].trim();

                complaint.regulatedEntity = values[12].trim();

                complaint.county = values[13];

                //Get an object full of the four tables we want

                // const tableObject = page.getElementsByClassName('waciDetail');

                // //Get an array

                // const tableArray = Object.values(tableObject).map((element: any)=>{
                //     return element
                // })

                complaint.description = values[14].replace(/\s\s+/g, ' ').trim();

                complaint.comment = values[15].replace(/\s\s+/g, ' ').trim();

                complaint.actionTaken = values[16];

                const properties = Object.entries(complaint);

                if (properties.some(isNullOrUndefined)) {
                    return reject('Scraper pulled null or undefined data');
                }

                return resolve(complaint);

            } catch (e) {
                return reject(`Failure in parseComplaint: ${e}`);
            }

        }
    });
}
