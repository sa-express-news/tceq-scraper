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

export function pageFromString(str: string) {
    if (Object.prototype.toString.call(str) !== "[object String]") {

        throw Error('variable passed to pageFromString is not a string');
    } else{
        const dom = new JSDOM(string);
        console.log(dom.window.document.getElementsByClassName('waciListValue'));
        return dom.window.document;
    }
}

export function isString(item: string) {
    return Object.prototype.toString.call(item) === "[object String]";
}

export function extractIntegerFromString(str: string) {
    if (Object.prototype.toString.call(str) !== "[object String]") {

        throw Error('variable passed to extractNumberFromString is not a string');
    } else {

        return parseInt(str.match(/\d/g).join(''));
    }
}
