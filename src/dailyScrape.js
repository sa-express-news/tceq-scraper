// @flow

'use strict';

import 'babel-polyfill';

import { createRequestObject } from './utility';
import { grabComplaints } from './complaintGrabber';
import { parseComplaint } from './complaintParser';
import { insertComplaint } from './database';
import { sendMail } from './mailer';
import { pgp } from './dbConnect';

require('dotenv').config();

export async function scrapeDaily() {
    return new Promise(async(resolve, reject) => {
        try {
            const requestObject = createRequestObject(new Date('12/14/16'));

            const complaintListObject = await grabComplaints(requestObject);

            const complaintList = Object.values(complaintListObject);

            const arrayOfComplaints = await Promise.all(complaintList.map((url) => {
                    return parseComplaint(url);
                }))
                .catch((error) => {
                    // console.log(error);
                    return reject(error);
                });



            const insertComplaints = await Promise.all(arrayOfComplaints.forEach((complaint) => {
                    insertComplaint(complaint)
                        .then((result) => {
                            return (result);
                        }).catch((error) => {
                            return (error);
                        });
                }))
                .catch((error) => {
                    // console.log(error);
                    return reject(error);
                });

            pgp.end();

            // const complaintData = await parseComplaint(complaintList[0]);
            // let complaintInserted = await insertComplaint(complaintData);

            const emailRecipients = process.env.EMAIL_RECIPIENTS.split(',');

            // console.log(arrayOfComplaints);

            sendMail(arrayOfComplaints, emailRecipients)
                .then((result)=>{
                    return resolve(true);
                })
                .catch((error)=>{
                    return reject(error);
                });

            // let mailSent = await sendMail(arrayOfComplaints, emailRecipients);
            // return resolve(true);



        } catch (e) {
            return reject(e);
        }


    })
}

// export default class DailyScraper {
//     async scrapeDaily() {
//         const requestObject = createRequestObject(new Date());

//         const complaintList = await grabComplaints(requestObject);

//         complaintList.forEach((complaint) => {
//             let complaintData = await parseComplaint(complaint);
//             let complaintInserted = await insertComplaint(complaintData);
//         });

//         const emailRecipients = process.env.EMAIL_RECIPIENTS.split(',');

//         let mailSent = await sendMail(complaintList);
//     }
// }