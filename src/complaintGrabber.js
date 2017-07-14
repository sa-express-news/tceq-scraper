// @flow

'use strict';

import { isObject, deduplicateArray, isComplaintLink } from './utility';

const rp = require('request-promise-native');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

//Create a cookie jar to capture cookies from the server
//that can be used across multiple requests
let cookieJar = rp.jar();

export function grabComplaints(params: Object) {
    return new Promise(async (resolve, reject) => {
        if (!isObject(params)) {
            return reject(`You didn't pass an object to grabComplaints, instead passed a ${typeof params}`);
        }
        if (!hasRightParameters(params)) {
            return reject(`Object passed to grabComplaints doesn't have proper request parameters`);
        }

        let postOptions = {
            method: 'POST',
            uri: 'http://www2.tceq.texas.gov/oce/waci/index.cfm?fuseaction=home.search',
            form: params,
            jar: cookieJar
        };

        return resolve(rp(postOptions)
            .then(async function(body) {
                let dom = new JSDOM(body);
                let page = dom.window.document;

                const allLinksOnPage = Object.values(page.getElementsByTagName('a')).map((a: any) => {
                    return a.href;
                });

                let complaintLinks = deduplicateArray(allLinksOnPage.filter(isComplaintLink));

                if (complaintLinks.length === 20) {

                    let furtherResults = await (getMorePages(2));

                    complaintLinks = [complaintLinks, furtherResults].reduce((acc, cur) => acc.concat(cur));
                }

                //Add leading http:// protocol and domain back to links, because the search results don't include them.

                const completeComplaintLinks = complaintLinks.map((link)=>{
                    return `http://www2.tceq.texas.gov/oce/waci/${link}`;
                });

                return completeComplaintLinks;
            })
            .catch(function(err) {
                console.log(err);
                return err;
            }));
    });


    //Recursive function to get all the complaints after the first page.
    //makes a GET request with the cookies our POST request got in the first ping.
    //Does the same DOM parsing as above, creating an array of complaint links.
    //If there are 20 complaint links, there could be another page of results - 
    //so we recursively call the same function, each time adding on the previous results
    //until there are no more left to parse.
    function getMorePages(searchPage: number) {
        return new Promise(async (resolve, reject) => {
            let getOptions = {
                method: 'GET',
                uri: `http://www2.tceq.texas.gov/oce/waci/index.cfm?fuseaction=home.search&pageNumber=${searchPage}`,
                jar: cookieJar
            };

            return resolve(rp(getOptions)
                .then(async function(body) {
                    let dom = new JSDOM(body);
                    let page = dom.window.document;

                    const allLinksOnPage = Object.values(page.getElementsByTagName('a')).map((a: any) => {
                        return a.href;
                    });

                    let complaintLinks = deduplicateArray(allLinksOnPage.filter(isComplaintLink));

                    if (complaintLinks.length === 20) {
                        const nextPageOfLinks = await getMorePages(searchPage + 1);

                        complaintLinks = [complaintLinks, nextPageOfLinks].reduce((acc, cur) => acc.concat(cur));
                    }

                    return complaintLinks;

                })
                .catch(function(err) {
                    console.log(err);
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
