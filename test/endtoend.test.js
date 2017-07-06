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
import { db, pgp } from '../src/dbConnect';
import { createRequestObject, isComplaintObject } from '../src/utility';

after(function() {
    pgp.end();
});

describe('End-to-end tests', function() {
    this.timeout(1000000000);
    describe('July 1-2 2017 - Four complaints', function() {
        before(async function() {
            const requestParams = await createRequestObject(new Date('7/2/17'));

            const complaintLinks = await grabComplaints(requestParams);

            const arrayOfComplaints = await Promise.all(complaintLinks.map((link) => {
                return parseComplaint(link);
            }));

            const databaseInserts = await Promise.all(arrayOfComplaints.map((complaint) => {
                return insertComplaint(complaint);
            }));
        });

        after(function() {
            wipeTable('complaints');
        });

        it('should successfully insert complaint #262386 into the database', async function() {

            const complaint = await db.one(`SELECT * FROM complaints WHERE tracking_number = 262386`, [true]);

            console.log(complaint);

            assert.isTrue(true);

        });
    });
});
