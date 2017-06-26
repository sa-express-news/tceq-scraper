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

import { fetchPage } from '../src/utility';

const pageFetcher = fetchPage;

describe('Utilities', function() {
    describe('Page Fetcher', function() {
        it('should exist', function() {
            assert.isDefined(pageFetcher);
        });
        it('should reject if passed a non-string', function() {
            assert.isRejected(pageFetcher(0));
            assert.isRejected(pageFetcher({ foo: 'bar' }));
            assert.isRejected(pageFetcher(new Date()));
            assert.isRejected(pageFetcher([0, 5]));
        });
        it.skip('should return a Document object', function() {
            const url = 'http://tx.healthinspections.us/san%20antonio/search.cfm?1=1&sd=06/12/2017&ed=06/19/2017&kw1=&kw2=&kw3=&rel1=L.licenseName&rel2=L.licenseName&rel3=L.licenseName&zc=&dtRng=YES&pre=similar&smoking=ANY';
            return assert.eventually.typeOf(pageFetcher(url), 'Document');
        });
    });

})
