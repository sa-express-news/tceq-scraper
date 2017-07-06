// @flow

'use strict';

import { isString, extractIntegerFromString, fetchPage, isNullOrUndefined, convertKeysToUnderscores } from './utility';

export function parseComplaint(url: string) {
    return new Promise(async(resolve, reject) => {
        if (!isString(url)) {

            reject('Non-string passed to complaintParser.js');
        } else {

            try {
                let page = await fetchPage(url);

                let complaint = {};

                const htmlCollection = page.getElementsByClassName('waciListValue');

                const values = Object.values(htmlCollection).map((element: any) => {
                    return element.textContent;
                });

                if (values.length === 0) {
                    return complaint;
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

                complaint.program = values[8];

                complaint.priority = values[9];

                //Remove ugly tabs and newlines in this property (but still space out separate effects)
                complaint.effect = values[10].replace(/\t/g, '').replace(/\n/g, ' ');

                complaint.receivingWater = values[11];

                complaint.regulatedEntity = values[12];

                complaint.county = values[13];

                complaint.description = values[14];

                complaint.comment = values[15];

                complaint.actionTaken = values[16];

                const properties = Object.entries(complaint);

                if (properties.some(isNullOrUndefined)) {
                    reject('Scraper pulled null or undefined data');
                }

                resolve(complaint);

            } catch(e){
                console.log(e);
            }

        }
    });
}

// export function extractInformation(page: Object) {
//     if (Object.prototype.toString.call(page) !== "[object Document]") {

//         throw Error('variable passed to extractInformation is not a Document object');
//     } else {


//     }
// }
