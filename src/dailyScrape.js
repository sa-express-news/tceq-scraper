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
            //Build a request object
            const requestParams = createRequestObject(new Date());

            //Grab links to all the complaints for the given range
            const complaintListObject = await grabComplaints(requestParams);

            //Turn the object into an array
            const complaintLinks = Object.values(complaintListObject);

            if(complaintLinks.length === 0){
                return resolve(false);
            }

            //Move through the array, parsing every complaint
            const arrayOfComplaints = await Promise.all(complaintLinks.map((url) => {
                return parseComplaint(url);
            }));

            //Insert every complaint into the database
            const insertComplaints = await Promise.all(arrayOfComplaints.map((complaint) => {
                return insertComplaint(complaint);
            }));

            //Disconnect from the database
            pgp.end();

            const emailRecipients = process.env.EMAIL_RECIPIENTS.split(',');

            //Send the complaints as an email
            const sentMail = await sendMail(arrayOfComplaints, emailRecipients);

            return resolve(true);
        } catch (e) {
            console.log('catching', e);
            return reject(e);
        }


    })
}