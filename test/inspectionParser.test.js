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

import { parseInspection, extractInformation } from '../src/inspectionParser';
// import { fetchPage } from '../src/utility';

const url = 'http://www2.tceq.texas.gov/oce/waci/index.cfm?fuseaction=home.complaint&incid=259738';

describe('Inspection Parser', function() {
    it('should exist', function() {
        assert.isDefined(parseInspection);
    });

    it('should reject if passed a non-string', function() {
        return Promise.all([
            assert.isRejected(parseInspection(0)),
            assert.isRejected(parseInspection({ foo: 'bar' })),
            assert.isRejected(parseInspection(new Date())),
            assert.isRejected(parseInspection([0, 5]))
        ]);
    });


    describe('Result', function() {

        this.timeout(1000000);

        let object;

        before(function() {
            return parseInspection(url)
                .then((result) => {
                    object = result;
                });
        });

        it('should be an object', function() {
            assert.isObject(object);
        });


        it('should have a trackingNumber property', function() {
            assert.property(object, 'trackingNumber');
        });

        describe('trackingNumber', function() {

            it('should be a number', function() {
                assert.isNumber(object.trackingNumber);
            });

        });

        it('should have a dateReceived property', function() {
            assert.property(object, 'dateReceived');
        });

        describe('dateReceived', function() {
            it('should be a Date', function() {
                assert.typeOf(object.dateReceived, 'date');
            });
        });

        it('should have a numberComplaining property', function() {
            assert.property(object, 'numberComplaining');
        });

    });
});






//PROBABLY DELETE THIS

describe.skip('Information extractor', function() {
    it('should exist', function() {
        assert.isDefined(extractInformation);
    });

    it('should throw an error if passed a non-Document object', function() {

        assert.throws(() => extractInformation(5));
        assert.throws(() => extractInformation([5, 'foo', 'bar']));
        assert.throws(() => extractInformation({ foo: 'bar' }));
        assert.throws(() => extractInformation(null));
    });

    describe('results', function() {

        let object;

        before(function() {
            return fetchPage(url)
                .then((result) => {
                    object = result;
                });
        });

        it('should return an object', function() {
            assert.isObject(extractInformation(object));
        });



    });
});
