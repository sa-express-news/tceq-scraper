'use strict';

import { isInspectionObject, convertKeysToUnderscores } from './utility';

import { db } from './dbConnect';

export function insertInspection(inspection: Object) {
    return new Promise((resolve, reject) => {
        if (Object.prototype.toString.call(inspection) !== '[object Object]') {
            return reject(`Variable passed to insertInspection is a ${typeof inspection} instead of an object`);
        } else if (!isInspectionObject(inspection)) {
            return reject(`Object passed to insertInspection does not match expected format`);
        } else {
            const underscoreKeys = convertKeysToUnderscores(inspection);

            const values = Object.values(underscoreKeys);

            return resolve(db.none({
                    text: 'INSERT INTO complaints VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)',
                    values: values
                })
                .then(() => {
                    return inspection;
                })
                .catch((error) => {
                    return error;
                }));
        }
    })
}

export function wipeTable(table) {
    db.none(`DELETE FROM ${table}`)
        .then(() => {

        })
        .catch((error) => {
            console.log(error);
        })
}
