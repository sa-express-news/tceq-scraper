'use strict';

require('dotenv').config();

const nodemailer = require('nodemailer');

import { isInspectionObject, isString, prettyPrintObject } from './utility';

export function sendMail(inspection: Object, addresses: Array < string > ) {
    return new Promise((resolve, reject) => {
        if (!isInspectionObject(inspection)) {
            reject(`You did not pass an object to sendMail, instead passed a ${typeof inspection}`);
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

            let inspectionAsString = prettyPrintObject(inspection);

            let mailOptions = {
                from: `"Kia Farhang" <${process.env.EMAIL_SENDER}>`,
                to: `${addresses.join(',')}`,
                subject: 'New TCEQ complaint',
                text: inspectionAsString
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    reject(error);
                }
                resolve(inspection);
            });
        }
    })

}
