// @flow

'use strict';

const jsdom = require("jsdom");
const { JSDOM } = jsdom;

export function fetchPage(url: string) {
    return new Promise((resolve, reject) => {
        if (Object.prototype.toString.call(url) !== "[object String]") {
            return reject('Variable passed to fetchPage is not a string');
        } else {
            JSDOM.fromURL(url).then(dom => {
                const page = dom.window.document;
                return resolve(page);
            });
        }
    });
}

export function pageFromString(str: string) {
    if (Object.prototype.toString.call(str) !== "[object String]") {

        throw Error('variable passed to pageFromString is not a string');
    } else{
        const dom = new JSDOM(str);
        return dom.window.document;
    }
}

export function isString(item: string) {
    return Object.prototype.toString.call(item) === "[object String]";
}

export function isObject(item: Object) {
    return Object.prototype.toString.call(item) === "[object Object]";
}

export function extractIntegerFromString(str: string) {
    if (Object.prototype.toString.call(str) !== "[object String]") {

        throw Error('variable passed to extractNumberFromString is not a string');
    } else {
        let numbers = str.match(/\d/g);

        if (numbers !== null && numbers !== undefined) {
            const spacesRemoved = numbers.join('');
            return parseInt(spacesRemoved);

        } else {
            throw Error('string passed to extractNumberFromString contains no numbers');
        }
    }
}

export function isNullOrUndefined(value: any) {
    return value === null || value === undefined;
}

export function convertKeysToUnderscores(object: Object) {
    if (Object.prototype.toString.call(object) !== '[object Object]') {
        throw Error('variable passed to convertKeysToUnderscores is not an object');
    } else {

        const entries = Object.entries(object);

        const entries_underscores = entries.map((entry) => {
            let currentKey = entry[0];
            let match = currentKey.match((/\w*[A-Z]\w*/));

            if (match !== null && match !== undefined) {
                let newKey = match[0].split(/(?=[A-Z])/).join('_').toLowerCase();
                entry[0] = newKey;
            }

            return entry;

        });


        const newObject = {};

        entries_underscores.forEach((entry) => {
            newObject[entry[0]] = entry[1];
        });

        return newObject;
    }
}

export function prettyPrintObject(object: Object) {
    if (Object.prototype.toString.call(object) !== '[object Object]') {
        throw Error('variable passed to prettyPrintObject is not an object');
    } else {
        const entries = Object.entries(object);

        const array = entries.map((entry: any) => {
            if (Object.prototype.toString.call(entry[1]) === '[object Object]') {
                entry[1] = `{${prettyPrintObject(entry[1])}}`;
            }
            let key = entry[0];
            let value = entry[1].toString();
            let string = `\n${key}: ${value}`;
            return string;
        });

        //remove the first newline
        return array.join('').slice(1);
    }
}

export function prettyPrintObjectAsHTML(object: Object) {
    if (Object.prototype.toString.call(object) !== '[object Object]') {
        throw Error('variable passed to prettyPrintObject is not an object');
    } else {
        const entries = Object.entries(object);

        const array = entries.map((entry: any) => {
            if (Object.prototype.toString.call(entry[1]) === '[object Object]') {
                entry[1] = `{${prettyPrintObjectAsHTML(entry[1])}}`;
            }
            let key = entry[0];
            let value = entry[1].toString();
            let string = `<p><strong>${key}:</strong> ${value}</p>`;
            return string;
        });

        //remove the first newline
        return array.join('');
    }
}

export function isComplaintObject(object: Object) {
    if (Object.prototype.toString.call(object) !== '[object Object]') {
        return false;
    } else {

        const expectedProperties = [
            'trackingNumber',
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
            'county',
            'description',
            'comment',
            'actionTaken'
        ];

        const objectProperties = Object.keys(object);

        if (compareArrays(expectedProperties.sort(), objectProperties.sort())) {
            return true;
        } else {
            return false;
        }

        function compareArrays(a, b) {
            return !a.some(function(e, i) {
                return e != b[i];
            });
        }
    }
}


export function createRequestObject(endDate: Date, optionalStartDate: Date) {
    if (Object.prototype.toString.call(endDate) !== "[object Date]") {
        throw Error('variable passed to createRequestObject is not a date');
    } else {

        const millisecondsInADay = 86400000;
        const startDate = (!optionalStartDate) ? new Date(endDate.getTime() - millisecondsInADay) : optionalStartDate;

        let object = {
            start_date_month: startDate.getMonth() + 1,
            start_date_day: startDate.getDate(),
            start_date_year: startDate.getFullYear(),
            end_date_month: endDate.getMonth() + 1,
            end_date_day: endDate.getDate(),
            end_date_year: endDate.getFullYear(),
            doit: 'Find'
        };
        return object;
    }
}

export function deduplicateArray(array: Array < any > ) {
    if (!Array.isArray(array)) {
        throw Error('variable passed to deduplicateArray is not an array');
    } else {
        let newArray = [];
        const set = new Set(array);
        for (let item of set) newArray.push(item);
        return newArray;
    }

}

export function isComplaintLink(link: string) {
    return Object.prototype.toString.call(link) === "[object String]" && link.indexOf('index.cfm?fuseaction=home.complaint&incid=') !== -1;
}
