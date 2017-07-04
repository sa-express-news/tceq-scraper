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

import { sendMail } from '../src/mailer.js';

describe('Mail sender', function() {
    it('should exist', function() {
        assert.isDefined(sendMail);
    });

    it('should reject if not passed an inspection object', function() {

        const secondArgument = ['foo'];

        return Promise.all([
            assert.isRejected(sendMail({ foo: 'bar' }, secondArgument)),
            assert.isRejected(sendMail('foobar', secondArgument)),
            assert.isRejected(sendMail([0, 1, 2], secondArgument)),
            assert.isRejected(sendMail(45, secondArgument)),
            assert.isRejected(sendMail(new Date(), secondArgument))
        ]);

    });

    it('should reject if not passed an array of strings as second argument', function() {

        return Promise.all([
            assert.isRejected(sendMail(inspectionObject)),
            assert.isRejected(sendMail(inspectionObject, 'foo@bar.com')),
            assert.isRejected(sendMail(inspectionObject, { foo: 'bar' })),
            assert.isRejected(sendMail(inspectionObject, 500)),
            assert.isRejected(sendMail(inspectionObject, ['foo', 500])),
            assert.isRejected(sendMail(inspectionObject, [{ foo: 'bar' }, 500]))
        ]);
    });
});




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
