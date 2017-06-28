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

import { insertInspection, wipeTable } from '../src/database.js';
import { db, pgp } from '../src/dbConnect';

describe('Database', function() {

    let inspectionObject = {
        trackingNumber: 1555,
        dateReceived: new Date(),
        numberComplaining: 1,
        status: 'Good',
        statusDate: new Date(),
        nature: 'foo',
        frequency: 'foo',
        duration: 'foo',
        media: 'foo',
        program: 'foo',
        priority: 'foo',
        effect: 'foo',
        receivingWater: 'foo',
        regulatedEntity: 'foo',
        county: 'foo',
        description: 'foo',
        comment: 'foo',
        actionTaken: 'foo'
    };


    describe('Insert Inspection', function() {

        afterEach(function() {
            wipeTable('complaints');
        });

        after(function() {
            pgp.end();
        });

        it('should exist', function() {
            assert.isDefined(insertInspection);
        });

        it('should reject if not passed an object', function() {
            return Promise.all([
                assert.isRejected(insertInspection('foobar')),
                assert.isRejected(insertInspection(500)),
                assert.isRejected(insertInspection(['foo', 'bar', undefined])),
                assert.isRejected(insertInspection(null))
            ]);
        });

        it('should reject if object passed does not have all inspection keys', function() {
            return Promise.all([
                assert.isRejected(insertInspection({ foo: 'baz' })),
                assert.isRejected(insertInspection({ trackingNumber: 522, dateReceived: new Date() }))
            ]);
        });

        it.skip('should successfully insert the inspection object', function() {
            insertInspection(inspectionObject)
                .then(() => {
                    db.one('SELECT * FROM complaints', [true])
                        .then((data) => {
                            assert.isDefined(data);
                        });
                });
        });

        it('should resolve with the inspection object on a successful INSERT', function() {
        
            //The test before this one finishes after this one starts.
            //We change the tracking number of the object for this test
            //So we don't insert a unique constraint that's already in
            //the DB (because the prior test hasn't finished yet).
            inspectionObject.trackingNumber = 1556;

            return assert.eventually.equal(insertInspection(inspectionObject), inspectionObject);
        });
    });

})
