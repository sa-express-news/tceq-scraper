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
import { createRequestObject, isComplaintObject, fetchPage } from '../src/utility';

describe('Integration tests', function() {
    this.timeout(100000000);
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

            it('should return an array', async function() {
                assert.isArray(arrayOfComplaints);
            });
        });
    });

});
