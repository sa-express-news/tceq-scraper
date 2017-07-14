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

import { grabComplaints } from '../../src/complaintGrabber';
import { parseComplaint } from '../../src/complaintParser';
import { insertComplaint, wipeTable } from '../../src/database';
import { db } from '../../src/dbConnect';
import { createRequestObject, isComplaintObject } from '../../src/utility';

describe('Integration tests', function() {
    this.timeout(30000);
    describe('Complaint Grabber -> Complaint Parser', function() {
        describe('One page of results', function() {
            let requestParams, arrayOfComplaintLinks, arrayOfComplaints;

            before(async function() {

                requestParams = createRequestObject(new Date('7/4/17'));
                arrayOfComplaintLinks = await grabComplaints(requestParams);
                arrayOfComplaints = await Promise.all(arrayOfComplaintLinks.map(async(link) => {
                    return parseComplaint(link);
                }));
            });

            it('should return an array', function() {
                assert.isArray(arrayOfComplaints);
            });

            it('should be an array of inspection objects', function() {
                arrayOfComplaints.forEach((complaint) => {
                    assert.isTrue(isComplaintObject(complaint));
                });
            });


        });

        describe('Multiple pages of results', function() {
            let requestParams, arrayOfComplaintLinks, arrayOfComplaints;

            before(async function() {

                requestParams = createRequestObject(new Date('6/21/17'));
                arrayOfComplaintLinks = await grabComplaints(requestParams);
                arrayOfComplaints = await Promise.all(arrayOfComplaintLinks.map((link) => {
                    return parseComplaint(link);
                }));
            });

            it('should return an array', function() {
                assert.isArray(arrayOfComplaints);
            });

            it('should be an array of inspection objects', function() {
                arrayOfComplaints.forEach((complaint) => {
                    assert.isTrue(isComplaintObject(complaint));
                });
            });

            it('should have a length > 20', function() {
                assert.isAbove(arrayOfComplaints.length, 20);
            });

        });
    });

    describe('Complaint Parser -> Database Insert', function() {
        before(async function() {

            const url = 'http://www2.tceq.texas.gov/oce/waci/index.cfm?fuseaction=home.complaint&incid=260575';

            const complaintObject = await parseComplaint(url);

            const complaintInserted = await insertComplaint(complaintObject);

        });

        after(async function() {
            wipeTable('complaints');
        });

        it('should successfully insert the complaint', async function() {

            const complaint = await db.one(`SELECT * FROM complaints`, [true]);

            assert.isDefined(complaint);

        });

    });

});
