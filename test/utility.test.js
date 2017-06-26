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

import { fetchPage, pageFromString, isString, extractIntegerFromString } from '../src/utility';

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

    describe('Number from string extractor', function() {
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

});
