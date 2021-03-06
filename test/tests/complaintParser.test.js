'use strict';

// //Tell Node not to freak out when I don't catch promise
// //rejections in tests
// process.on('unhandledRejection', function(reason, p) {
//     return;
// });

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const assert = chai.assert;

import { parseComplaint, extractInformation } from '../../src/complaintParser';
// import { fetchPage } from '../src/utility';

const url = 'http://www2.tceq.texas.gov/oce/waci/index.cfm?fuseaction=home.complaint&incid=259738';

describe('Complaint Parser', function() {
    it('should exist', function() {
        assert.isDefined(parseComplaint);
    });

    it('should reject if passed a non-string', function() {
        return Promise.all([
            assert.isRejected(parseComplaint(0)),
            assert.isRejected(parseComplaint({ foo: 'bar' })),
            assert.isRejected(parseComplaint(new Date())),
            assert.isRejected(parseComplaint([0, 5]))
        ]);
    });

    it('should reject if passed a non-existent complaint URL', function() {

        let badURL = 'http://www2.tceq.texas.gov/oce/waci/index.cfm?fuseaction=home.complaint&incid=150000';

        return Promise.all([
            assert.isRejected(parseComplaint(badURL))
        ]);
    })


    describe('Result', function() {

        let object;

        before(function() {
            return parseComplaint(url)
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

        describe('numberComplaining', function() {

            it('should be a number', function() {
                assert.isNumber(object.numberComplaining);
            })
        });

        it('should have a status property', function() {
            assert.property(object, 'status');
        });

        describe('status', function() {

            it('should be a string', function() {
                assert.isString(object.status);
            });

            it('should be open, closed, or blank', function() {
                const acceptable = ['CLOSED', 'OPEN', ''];

                assert.include(acceptable, object.status);
            });
        });

        it('should have a statusDate property', function() {
            assert.property(object, 'statusDate');
        });

        describe('statusDate', function() {

            it('should be a date', function() {
                assert.typeOf(object.statusDate, 'date');
            });
        });

        it('should have a nature property', function() {
            assert.property(object, 'nature');
        });

        describe('nature', function() {

            it('should be a string', function() {
                assert.isString(object.nature);
            });
        })

        it('should have a frequency property', function() {
            assert.property(object, 'frequency');
        });

        describe('frequency', function() {

            it('should be a string', function() {
                assert.isString(object.frequency);
            });

            it('should be current, intermittent, past, predictable or blank', function() {
                const acceptable = ['CURRENT', 'INTERMITTENT', 'PAST', 'PREDICTABLE', ''];
                assert.include(acceptable, object.frequency);
            })
        });

        it('should have a duration property', function() {
            assert.property(object, 'duration');
        });

        describe('duration', function() {

            it('should be a string', function() {
                assert.isString(object.duration);
            });

            it('should be actual, estimated or blank', function() {
                const acceptable = ['ACTUAL', 'ESTIMATED', ''];
                assert.include(acceptable, object.duration);
            });
        });

        it('should have a media property', function() {
            assert.property(object, 'media');
        });

        describe('media', function() {

            it('should be a string', function() {
                assert.isString(object.media);
            });

            it('should be air, water, waste or blank', function() {
                const acceptable = ['AIR', 'WATER', 'WASTE', ''];
                assert.include(acceptable, object.media);
            });
        });

        it('should have a program property', function() {
            assert.property(object, 'program');
        });

        describe('program', function() {

            it('should be a string', function() {
                assert.isString(object.program);
            });

            it('should match one of the state programs', function() {
                const programs = [
                    'AIR QUALITY',
                    'EMERGENCY RESPONSE',
                    'OCCUPATIONAL LICENSING',
                    'WATER QUALITY',
                    'WASTEWATER AGRICULTURE',
                    'DAM SAFETY',
                    'DISTRICTS',
                    'EMERGENCY RESPONSE',
                    'FLOODPLAIN MANAGEMENT',
                    'PUBLIC WATER SAFETY/SUPPLY',
                    'UNDERGROUND INJECTION CONTROL',
                    'UTILITIES',
                    'WATER RIGHTS',
                    'OCCUPATIONAL LICENSING',
                    'INDUSTRIAL & HAZARDOUS WASTE',
                    'MUNICIPAL SOLID WASTE',
                    'PETROLEUM STORAGE TANK',
                    'REMEDIATION',
                    'EMERGENCY RESPONSE',
                    'RADIOACTIVE WASTE',
                    'OCCUPATIONAL LICENSING'
                ];

            });
        });

        it('should have a priority property', function() {
            assert.property(object, 'priority');
        });

        describe('priority', function() {

            it('should be a string', function() {
                assert.isString(object.priority);
            });
        });

        it('should have an effect property', function() {
            assert.property(object, 'effect');
        });

        describe('effect', function() {
            it('should be a string', function() {
                assert.isString(object.effect);
            });
        });

        it('should have a receivingWater property', function() {
            assert.property(object, 'receivingWater');
        });

        describe('receivingWater', function() {

            it('should be a string', function() {
                assert.isString(object.receivingWater);
            });
        });

        it('should have a regulatedEntity property', function() {
            assert.property(object, 'regulatedEntity');
        });

        describe('regulatedEntity', function() {

            it('should be a string', function() {
                assert.isString(object.regulatedEntity);
            });
        });

        it('should have a county property', function() {
            assert.property(object, 'county');
        });

        describe('county', function() {

            it('should be a string', function() {
                assert.isString(object.county);
            });
        });

        it('should have a description property', function() {
            assert.property(object, 'description');
        });

        describe('description', function() {

            it('should be a string', function() {
                assert.isString(object.description);
            });
        });

        it('should have a comment section', function() {
            assert.property(object, 'comment');
        });

        describe('comment', function() {

            it('should be a string', function() {
                assert.isString(object.comment);
            });
        });

        it('should have an actionTaken property', function() {
            assert.property(object, 'actionTaken');
        });

        describe('actionTaken', function() {

            it('should be a string', function() {
                assert.isString(object.actionTaken);
            });
        });

    });
});
