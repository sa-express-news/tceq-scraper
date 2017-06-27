// @flow

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

// export function pageFromString(str: string) {
//     if (Object.prototype.toString.call(str) !== "[object String]") {

//         throw Error('variable passed to pageFromString is not a string');
//     } else{
//         const dom = new JSDOM(string);
//         console.log(dom.window.document.getElementsByClassName('waciListValue'));
//         return dom.window.document;
//     }
// }

export function isString(item: string) {
    return Object.prototype.toString.call(item) === "[object String]";
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

export function isInspectionObject(object: Object) {
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
