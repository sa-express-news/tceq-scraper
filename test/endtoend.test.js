'use strict';

//Tell Node not to freak out when I don't catch promise
//rejections in tests
process.on('unhandledRejection', function(reason, p) {
    return;
});

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const assert = chai.assert;

import { grabComplaints } from '../src/complaintGrabber';
import { parseComplaint } from '../src/complaintParser';
import { insertComplaint, wipeTable } from '../src/database';
import { db } from '../src/dbConnect';
import { createRequestObject, isComplaintObject } from '../src/utility';

//We don't test status, status date, frequency because those can get updated over time

describe('End-to-end tests', function() {

    this.timeout(1000000000);
    describe('July 1-2 2017 - Four complaints', function() {

        let complaints;

        before(async function() {
            const requestParams = await createRequestObject(new Date('7/2/17'));

            const complaintLinks = await grabComplaints(requestParams);

            const arrayOfComplaints = await Promise.all(complaintLinks.map((link) => {
                return parseComplaint(link);
            }));

            const databaseInserts = await Promise.all(arrayOfComplaints.map((complaint) => {
                return insertComplaint(complaint);
            }));

            complaints = await Promise.all(arrayOfComplaints.map((complaint) => {
                return db.one(`SELECT * FROM complaints WHERE tracking_number = ${complaint.trackingNumber}`);
            }));

        });

        after(function() {
            wipeTable('complaints');
        });

        describe('Complaints', function() {

            it('should successfully insert into the database', function() {

                complaints.forEach((complaint) => {
                    assert.isDefined(complaint);
                });
            });

            it('should have the proper tracking numbers', function() {

                let expected = [262386, 262409, 262376, 262394];

                complaints.forEach((complaint, index) => {
                    assert.strictEqual(complaint.tracking_number, expected[index]);
                });

            });

            it('should have the proper date received', function() {
                let expected = [new Date('7/1/17'), new Date('7/1/17'), new Date('7/2/17'), new Date('7/2/17')];

                complaints.forEach((complaint, index) => {
                    assert.strictEqual(new Date(complaint.date_received).toString(), expected[index].toString());
                });
            });

            it('should have the proper number complaining', function() {
                let expected = [1, 1, 1, 1];

                complaints.forEach((complaint, index) => {
                    assert.strictEqual(complaint.number_complaining, expected[index]);
                });
            });



            it('should have the proper nature', function() {
                let expected = ['WATER SUPPLY QUALITY', 'USED OIL', 'TURBIDITY', 'DUST'];

                complaints.forEach((complaint, index) => {
                    assert.strictEqual(complaint.nature, expected[index]);
                });
            });

            it('should have the proper duration', function() {
                let expected = ['ESTIMATED', '', 'ESTIMATED', ''];

                complaints.forEach((complaint, index) => {
                    assert.strictEqual(complaint.duration, expected[index]);
                });
            });

            it('should have the proper media', function() {
                let expected = ['WATER', 'WASTE', 'WATER', 'AIR'];

                complaints.forEach((complaint, index) => {
                    assert.strictEqual(complaint.media, expected[index]);
                });
            });

            it('should have the proper program', function() {
                let expected = ['PUBLIC WATER SYSTEM/SUPPLY',
                    'INDUSTRIAL AND HAZARDOUS WASTE - HIGH LEVEL',
                    'WATER QUALITY - HIGH LEVEL',
                    'AIR QUALITY - HIGH LEVEL'
                ];

                complaints.forEach((complaint, index) => {
                    assert.strictEqual(complaint.program, expected[index]);
                });
            });


        });


    });
});
