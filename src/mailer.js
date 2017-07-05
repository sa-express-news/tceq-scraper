'use strict';

require('dotenv').config();

const nodemailer = require('nodemailer');

import { isInspectionObject, isString, prettyPrintObject, prettyPrintObjectAsHTML } from './utility';

export function sendMail(inspections: Array < Object > , addresses: Array < string > ) {
    return new Promise((resolve, reject) => {
        if (!Array.isArray(inspections) || !inspections.every(isInspectionObject)) {
            reject(`You did not pass an array of inspections to sendMail, instead passed a ${typeof inspections}: ${inspections}`);
        } else if (!Array.isArray(addresses) || !addresses.every(isString)) {
            reject(`You didn't pass an array of email addresses to sendMail, instead passed a ${typeof addresses}`);
        } else {
            let transporter = nodemailer.createTransport({
                host: process.env.EMAIL_HOST,
                port: process.env.EMAIL_PORT,
                auth: { user: process.env.EMAIL_AUTH_USER, pass: process.env.EMAIL_AUTH_PASS },
                secureConnection: false,
                tls: { ciphers: 'SSLv3' }
            });

            let emailHTML = inspections.map((inspection)=>{
                return prettyPrintObjectAsHTML(inspection);
            }).join('<br/><br/>');

            let emailText = inspections.map((inspection)=>{
                return prettyPrintObject(inspection);
            }).join('');

            let mailOptions = {
                from: `"Kia Farhang" <${process.env.EMAIL_SENDER}>`,
                to: `${addresses.join(', ')}`,
                subject: 'New TCEQ complaints',
                text: emailText,
                html: emailHTML
            };

            // console.log(mailOptions);

            // return resolve('foo');

            transporter.sendMail(mailOptions, (error, info) => {
               if (error) {
                   reject(error);
               }
               resolve(inspections);
           });
        }
    })

}
