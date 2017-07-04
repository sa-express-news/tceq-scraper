// @flow

'use strict';

import { isObject, deduplicateArray, isComplaintLink } from './utility';

const rp = require('request-promise-native');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

export function grabInspections(params: Object) {
    return new Promise((resolve, reject) => {
        if (!isObject(params)) {
            return reject(`You didn't pass an object to grabInspections, instead passed a ${typeof params}: ${params}`);
        }
        if (!hasRightParameters(params)) {
            return reject(`Object passed to grabInspections doesn't have proper request parameters`);
        }

        let cookieJar = rp.jar();

        let postOptions = {
            method: 'POST',
            uri: 'http://www2.tceq.texas.gov/oce/waci/index.cfm?fuseaction=home.search',
            form: params,
            jar: cookieJar
        };

        return resolve(rp(postOptions)
            .then(function(body) {
                let dom = new JSDOM(body);
                let page = dom.window.document;

                const allLinksOnPage = Object.values(page.getElementsByTagName('a')).map((a) => {
                    return a.href;
                });

                const inspectionLinks = deduplicateArray(allLinksOnPage.filter(isComplaintLink));

                getMorePages(2)
                .then((result)=>{
                	console.log(result);
                })


                return inspectionLinks;
            })
            .catch(function(err) {
                return err;
            }));
    });


    function getMorePages(page: number) {
        return new Promise((resolve, reject) => {
            let getOptions = {
                method: 'GET',
                uri: `http://www2.tceq.texas.gov/oce/waci/index.cfm?fuseaction=home.search&pageNumber=${page}`,
                jar: cookieJar
            };

            return resolve(rp(getOptions)
                .then(function(body) {
                    let dom = new JSDOM(body);
                    let page = dom.window.document;

                    const allLinksOnPage = Object.values(page.getElementsByTagName('a')).map((a) => {
                        return a.href;
                    });

                    console.log('inside');

                    const inspectionLinks = deduplicateArray(allLinksOnPage.filter(isComplaintLink));

                    return inspectionLinks;
                })
                .catch(function(err) {
                    return err;
                }));
        });
    }
}

function hasRightParameters(object: Object) {
    return object.hasOwnProperty('start_date_month') && object.hasOwnProperty('start_date_day') &&
        object.hasOwnProperty('start_date_year') && object.hasOwnProperty('end_date_month') &&
        object.hasOwnProperty('end_date_day') && object.hasOwnProperty('end_date_year') &&
        object.hasOwnProperty('doit');
}
