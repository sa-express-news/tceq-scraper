'use strict';

require('dotenv').config();

const nodemailer = require('nodemailer');

import { isComplaintObject, isString, prettyPrintObject, prettyPrintObjectAsHTML } from './utility';

export function sendMail(complaints: Array < Object > , addresses: Array < string > ) {
    return new Promise((resolve, reject) => {
        if (!Array.isArray(complaints)) {
            return reject(`You did not pass an array of complaints to sendMail, instead passed a ${typeof complaints}: ${complaints}`);
        } else if (!Array.isArray(addresses) || !addresses.every(isString)) {
            return reject(`You didn't pass an array of email addresses to sendMail, instead passed a ${typeof addresses}`);
        } else {
            let transporter = nodemailer.createTransport({
                host: process.env.EMAIL_HOST,
                port: process.env.EMAIL_PORT,
                auth: { user: process.env.EMAIL_AUTH_USER, pass: process.env.EMAIL_AUTH_PASS },
                secureConnection: false,
                tls: { ciphers: 'SSLv3' }
            });

            let emailHTML = complaints.map((inspection) => {
                return prettyPrintObjectAsHTML(inspection);
            }).join('<br/><br/>');

            let emailText = complaints.map((inspection) => {
                return prettyPrintObject(inspection);
            }).join('');

            let mailOptions = {
                from: `"Kia Farhang" <${process.env.EMAIL_SENDER}>`,
                to: `${addresses.join(', ')}`,
                subject: 'New TCEQ complaints',
                text: emailText,
                html: emailHTML
            };

            transporter.sendMail(mailOptions)
                .then((result) => {
                    return resolve(complaints);
                })
                .catch((error) => {
                    return reject(error);
                });
        }
    })

}