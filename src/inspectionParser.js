// @flow

import { isString, extractIntegerFromString, fetchPage, isNullOrUndefined, convertKeysToUnderscores } from './utility';

export function parseInspection(url: string) {
    return new Promise((resolve, reject) => {
        if (!isString(url)) {

            return reject('Non-string passed to inspectionParser.js');
        } else {

            return resolve(fetchPage(url)
                .then((page) => {

                    let inspection = {};

                    inspection.trackingNumber = extractIntegerFromString(page.getElementsByClassName('waciListTitle')[0].textContent);

                    const htmlCollection = page.getElementsByClassName('waciListValue');

                    const values = Object.values(htmlCollection).map((element: any)=>{
                        return element.textContent;
                    });

                    inspection.dateReceived = new Date(values[0]);

                    inspection.numberComplaining = parseInt(values[1]);

                    inspection.status = values[2];

                    inspection.statusDate = new Date(values[3]);

                    inspection.nature = values[4];

                    inspection.frequency = values[5];

                    inspection.duration = values[6];

                    inspection.media = values[7];

                    inspection.program = values[8];

                    inspection.priority = values[9];

                    //Remove ugly tabs and newlines in this property (but still space out separate effects)
                    inspection.effect = values[10].replace(/\t/g, '').replace(/\n/g, ' ');

                    inspection.receivingWater = values[11];

                    inspection.regulatedEntity = values[12];

                    inspection.county = values[13];

                    inspection.description = values[14];

                    inspection.comment = values[15];

                    inspection.actionTaken = values[16];

                    const properties = Object.entries(inspection);

                    if(properties.some(isNullOrUndefined)){
                        return reject('Scraper pulled null or undefined data');
                    }
                    
                    return inspection;



                }));

        }
    });
}

// export function extractInformation(page: Object) {
//     if (Object.prototype.toString.call(page) !== "[object Document]") {

//         throw Error('variable passed to extractInformation is not a Document object');
//     } else {


//     }
// }
