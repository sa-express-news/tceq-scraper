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


