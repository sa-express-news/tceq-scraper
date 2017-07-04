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

import { grabInspections } from '../src/inspectionGrabber';

const dummyParams = {
    start_date_month: 6,
    start_date_day: 5,
    start_date_year: 2017,
    end_date_month: 6,
    end_date_day: 6,
    end_date_year: 2017,
    doit: 'Find'
};

describe('Inspection Grabber', function() {

    it('should exist', function() {
        assert.isDefined(grabInspections);
    });

    it('should reject if passed a non-object', function() {

        return Promise.all([
            assert.isRejected(grabInspections(0)),
            assert.isRejected(grabInspections('foo')),
            assert.isRejected(grabInspections(new Date())),
            assert.isRejected(grabInspections([0, 5]))
        ]);
    });

    it('should reject if passed an object without the proper properties', function() {
        const wayOff = { foo: 'bar' };
        const close = { start_date_month: 6, start_date_day: 15 };
        const closer = {
            start_date_month: 6,
            start_date_day: 15,
            start_date_year: 2017,
            end_date_month: 6,
            end_date_day: 16,
            end_date_year: 2017
        };

        return Promise.all([
            assert.isRejected(grabInspections(wayOff)),
            assert.isRejected(grabInspections(close)),
            assert.isRejected(grabInspections(closer))
        ]);
    });

    describe('Results', function() {
        this.timeout(10000000);
        let results;

        before(function() {
            return grabInspections(dummyParams)
                .then((result) => {
                    results = result;
                });
        });

        it('should resolve with an array', function() {
            assert.isArray(results);
        });

        it('should be an array of strings', function() {
            results.forEach(function(item) {
                assert.isString(item);
            });
        });

        it('should be an array of complaint links', function(){
        	results.forEach(function(item){
        		assert.include(item, 'index.cfm?fuseaction=home.complaint&incid=');
        	});
        });

        it('should contain no duplicates', function(){
        	let deduplicated = new Set(results);

        	assert.strictEqual(deduplicated.size, results.length);
        });


    });


});
