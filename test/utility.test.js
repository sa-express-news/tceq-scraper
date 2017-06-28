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

import { fetchPage, pageFromString, isString, extractIntegerFromString, dateFromString, isNullOrUndefined, convertKeysToUnderscores, prettyPrintObject, isInspectionObject } from '../src/utility';

const pageFetcher = fetchPage;

describe('Utilities', function() {

    describe('Page Fetcher', function() {

        it('should exist', function() {
            assert.isDefined(pageFetcher);
        });

        it('should reject if passed a non-string', function() {

            return Promise.all([
                assert.isRejected(pageFetcher(0)),
                assert.isRejected(pageFetcher({ foo: 'bar' })),
                assert.isRejected(pageFetcher(new Date())),
                assert.isRejected(pageFetcher([0, 5]))
            ]);

        });

        it.skip('should return a Document object', function() {

            const url = 'http://tx.healthinspections.us/san%20antonio/search.cfm?1=1&sd=06/12/2017&ed=06/19/2017&kw1=&kw2=&kw3=&rel1=L.licenseName&rel2=L.licenseName&rel3=L.licenseName&zc=&dtRng=YES&pre=similar&smoking=ANY';
            return assert.eventually.typeOf(pageFetcher(url), 'Document');

        });
    });

    describe.skip('Page from string', function() {

        it('should exist', function() {

            assert.isDefined(pageFromString);

        });

        it('should throw an error if passed a non-string', function() {

            assert.throws(() => pageFromString(5));
            assert.throws(() => pageFromString([5, 'foo', 'bar']));
            assert.throws(() => pageIntegerFromString({ foo: 'bar' }));
            assert.throws(() => pageIntegerFromString(null));

        });

        it('should return a Document object', function() {
            assert.typeOf(pageFromString(string), 'string');
        });
    });

    describe('String checker', function() {

        it('should exist', function() {
            assert.isDefined(isString);
        });

        it('should return true when passed strings', function() {
            const arrayOfStrings = ['foo', 'bar', 'blah'];

            arrayOfStrings.forEach(function(string) {
                assert.isTrue(isString(string));
            });
        });

        it('should return false when passed non-strings', function() {
            const arrayOfStuff = [1, new Date(), { foo: 'bar' },
                ['blah', 'foo']
            ];

            arrayOfStuff.forEach(function(thing) {
                assert.isNotTrue(isString(thing));
            });
        });
    });

    describe('Integer from string extractor', function() {

        it('should exist', function() {
            assert.isDefined(extractIntegerFromString);
        });

        it('should throw an error if passed a non-string', function() {

            assert.throws(() => extractIntegerFromString(5));
            assert.throws(() => extractIntegerFromString([5, 'foo', 'bar']));
            assert.throws(() => extractIntegerFromString({ foo: 'bar' }));
            assert.throws(() => extractIntegerFromString(null));

        });

        it('should throw an error if passed a string w/no numbers', function() {
            assert.throws(() => extractIntegerFromString('hello there'));
        });

        it('should return a number', function() {

            assert.isNumber(extractIntegerFromString('111'));

        });

        it('should return convert number strings to numbers', function() {

            assert.strictEqual(extractIntegerFromString('111'), 111);

        });

        it('should return one number if the numbers are spaced out', function() {

            assert.strictEqual(extractIntegerFromString('1 2 3'), 123);
            assert.strictEqual(extractIntegerFromString('42 years ago, I went to the store 5 times'), 425);
            assert.strictEqual(extractIntegerFromString('6849165   22       7 45 2'), 6849165227452);

        });
    });

    describe('Null/undefined checker', function() {
        it('should exist', function() {
            assert.isDefined(isNullOrUndefined);
        });

        it('should return true if value is null or defined', function() {

            assert.isTrue(isNullOrUndefined(null));
            assert.isTrue(isNullOrUndefined(undefined));

        });

        it('should return false for all other values', function() {

            assert.isNotTrue(isNullOrUndefined(true));
            assert.isNotTrue(isNullOrUndefined(false));
            assert.isNotTrue(isNullOrUndefined(0));
            assert.isNotTrue(isNullOrUndefined('hello'));
            assert.isNotTrue(isNullOrUndefined([true, 'false']));
            assert.isNotTrue(isNullOrUndefined({ foo: 'bar' }));
            assert.isNotTrue(isNullOrUndefined(new Date()));

        });
    });

    describe('Object key camelcase to underscore', function() {
        it('should exist', function() {
            assert.isDefined(convertKeysToUnderscores);
        });

        it('should throw an error if passed a non-object', function() {
            assert.throws(() => convertKeysToUnderscores(5));
            assert.throws(() => convertKeysToUnderscores([5, 'foo', 'bar']));
            assert.throws(() => convertKeysToUnderscores(100));
            assert.throws(() => convertKeysToUnderscores(null));
        });

        it('should return an object', function() {
            assert.isObject(convertKeysToUnderscores({ foo: 'bar' }));
        });

        it('should change all camelCase properties to underscores', function() {
            const object = { fooBar: 'baz', bigLongPropertyName: [0, 1] }
            const expected = { foo_bar: 'baz', big_long_property_name: [0, 1] }
            assert.deepEqual(convertKeysToUnderscores(object), expected);
        });

        it('should not change non-camelcase property names', function() {
            const object = {
                foo: 'bar',
                date: 500,
                shouldChange: [1, 2, 3]
            };

            const expected = {
                foo: 'bar',
                date: 500,
                should_change: [1, 2, 3],
            };

            assert.deepEqual(convertKeysToUnderscores(object), expected);
        })
    });

    describe('Object pretty printer', function() {

        const testObject = {
            trackingNumber: 259738,
            dateReceived: new Date(),
            numberComplaining: 1,
            status: 'CLOSED',
            statusDate: new Date(),
            nature: 'DUST',
            frequency: 'CURRENT',
            duration: '',
            media: 'AIR',
            program: ' AIR QUALITY - HIGH LEVEL',
            priority: 'Within   1 Working Day',
            effect: '  EAGLE FORD SHALE  GENERAL  OIL AND GAS  ',
            receivingWater: ' ',
            regulatedEntity: 'ALAMO JUNCTION RAIL PARK TRANSLOAD FACILITY',
            county: 'BEXAR',
            description: 'The San Antonio Regional Office received a complaint concerning odor. ',
            comment: 'More information will be available upon approval of the investigation report.',
            actionTaken: 'This complaint has been assigned and will be further investigated by an Environmental Investigator.'
        };

        it('should exist', function() {
            assert.isDefined(prettyPrintObject);
        });

        it('should throw an error if passed a non-object', function() {
            assert.throws(() => prettyPrintObject(5));
            assert.throws(() => prettyPrintObject([5, 'foo', 'bar']));
            assert.throws(() => prettyPrintObject(100));
            assert.throws(() => prettyPrintObject(null));
        });

        it('should return a string', function() {
            assert.isString(prettyPrintObject(testObject));
        });

        it('should add a space between object key and value', function() {
            let object = { foo: 'bar' };
            assert.include(prettyPrintObject(object), 'foo: bar');
        });

        it('should add a newline before each key-value pair, but not the first one', function() {
            let object = { foo: 'bar', baz: 'test' };
            assert.strictEqual(prettyPrintObject(object), 'foo: bar\nbaz: test');
        });

        it('should work with number values', function() {
            let object = { foo: 15, baz: 1.2 };
            assert.strictEqual(prettyPrintObject(object), 'foo: 15\nbaz: 1.2');
        });

        it('should work with date values', function() {
            let object = { foo: new Date('5/17/17'), bar: new Date('5/18/17') };
            let expectedString = 'foo: Wed May 17 2017 00:00:00 GMT-0500 (CDT)\nbar: Thu May 18 2017 00:00:00 GMT-0500 (CDT)';
            assert.strictEqual(prettyPrintObject(object), expectedString);
        });

        it('should work with array values', function() {
            let object = { foo: [0, 1], bar: [1, 2] };
            let expectedString = 'foo: 0,1\nbar: 1,2';
            assert.strictEqual(prettyPrintObject(object), expectedString);
        });

        it('should work with nested objects', function() {
            let object = { foo: { test: 'hello', test2: 'world' }, baz: 'test' }
            let expectedString = 'foo: {test: hello\ntest2: world}\nbaz: test';
            assert.strictEqual(prettyPrintObject(object), expectedString);
        });
    });

    describe('Inspection object tester', function() {
        it('should exist', function() {
            assert.isDefined(isInspectionObject);
        });

        it('should return false when passed a non-object', function() {
            assert.isFalse(isInspectionObject('foo'));
            assert.isFalse(isInspectionObject(500));
            assert.isFalse(isInspectionObject([1, 2, 3]));
            assert.isFalse(isInspectionObject(new Date()));
            assert.isFalse(isInspectionObject(function() {
                return true
            }));
        });
    });

    it('should return false if the object does not have every property needed', function() {
        const badObject = {
            dateReceived: new Date(),
            trackingNumber: 1555,
            numberComplaining: 1
        };

        assert.isFalse(isInspectionObject(badObject));
    });

    it('should return false if the object has the keys PLUS unwanted ones', function() {
        const tooMuch = {
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
            actionTaken: 'foo',
            extra: 'foo'
        };

        assert.isFalse(isInspectionObject(tooMuch));
    });

    it('should retun true if the object has only the keys desired', function() {
        const justRight = {
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

        assert.isTrue(isInspectionObject(justRight));
    })


});
