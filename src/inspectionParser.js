// @flow

import { isString, extractIntegerFromString, fetchPage } from './utility';

export function parseInspection(url: string) {
    return new Promise((resolve, reject) => {
        if (!isString(url)) {

            return reject('Non-string passed to inspectionParser.js');
        } else {

            return resolve(fetchPage(url)
                .then((page) => {

                    let inspection = {};

                    inspection.trackingNumber = extractIntegerFromString(page.getElementsByClassName('waciListTitle')[0].textContent);

                    inspection.dateReceived = new Date();

                    return inspection;


                }));

        }
    });
}

export function extractInformation(page: Object) {
    if (Object.prototype.toString.call(page) !== "[object Document]") {

        throw Error('variable passed to extractInformation is not a Document object');
    } else {


    }
}
