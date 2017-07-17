'use strict';

import { isComplaintObject, convertKeysToUnderscores } from './utility';

import { db } from './dbConnect';

export function insertComplaint(complaint: Object) {
    return new Promise((resolve, reject) => {
        if (Object.prototype.toString.call(complaint) !== '[object Object]') {
            return reject(`Variable passed to insertComplaint is a ${typeof complaint} instead of an object`);
        } else if (!isComplaintObject(complaint)) {
            return reject(`Object passed to insertComplaint does not match expected format`);
        } else {
            const underscoreKeys = convertKeysToUnderscores(complaint);

            const values = Object.values(underscoreKeys);

            db.none({
                    text: 'INSERT INTO complaints VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)',
                    values: values
                })
                .then((result) => {
                    return resolve(complaint);
                })
                .catch((error) => {
                    return reject(error);
                });
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