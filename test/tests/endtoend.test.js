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

//We don't test status, status date, frequency because those can get updated over time

describe('End-to-end tests', function() {

    describe('July 23-24 2016 - 2 complaints', function() {

        let complaints;

        before(async function() {
            const requestParams = createRequestObject(new Date('7/24/17'));

            const complaintLinks = await grabComplaints(requestParams);

            const arrayOfComplaints = await Promise.all(complaintLinks.map((link) => {
                return parseComplaint(link);
            }));

            const databaseInserts = await Promise.all(arrayOfComplaints.map((complaint) => {
                return insertComplaint(complaint);
            }));

            complaints = await Promise.all(arrayOfComplaints.map((complaint) => {
                return db.one(`SELECT * FROM complaints WHERE tracking_number = ${complaint.trackingNumber}`);
            }));

        });

        after(function() {
            wipeTable('complaints');
        });

        describe('Complaints', function() {

            it('should successfully insert into the database', function() {

                complaints.forEach((complaint) => {
                    assert.isDefined(complaint);
                });
            });

            it('should have the proper tracking numbers', function() {

                let expected = [243521, 243517];

                complaints.forEach((complaint, index) => {
                    assert.strictEqual(complaint.tracking_number, expected[index]);
                });

            });

            it('should have the proper date received', function() {
                let expected = [new Date('7/23/16'), new Date('7/23/16')];

                complaints.forEach((complaint, index) => {
                    assert.strictEqual(new Date(complaint.date_received).toString(), expected[index].toString());
                });
            });

            it('should have the proper number complaining', function() {
                let expected = [1, 1];

                complaints.forEach((complaint, index) => {
                    assert.strictEqual(complaint.number_complaining, expected[index]);
                });
            });



            it('should have the proper nature', function() {
                let expected = ['OTHER', 'OTHER'];

                complaints.forEach((complaint, index) => {
                    assert.strictEqual(complaint.nature, expected[index]);
                });
            });

            it('should have the proper duration', function() {
                let expected = ['', ''];

                complaints.forEach((complaint, index) => {
                    assert.strictEqual(complaint.duration, expected[index]);
                });
            });

            it('should have the proper media', function() {
                let expected = ['AIR', 'AIR'];

                complaints.forEach((complaint, index) => {
                    assert.strictEqual(complaint.media, expected[index]);
                });
            });

            it('should have the proper program', function() {
                let expected = ['AIR QUALITY - HIGH LEVEL', 'AIR QUALITY - HIGH LEVEL'];

                complaints.forEach((complaint, index) => {
                    assert.strictEqual(complaint.program, expected[index]);
                });
            });

            it('should have the proper priority', function() {
                let expected = ['Refer or Do Not Respond', 'Refer or Do Not Respond'];

                complaints.forEach((complaint, index) => {
                    assert.strictEqual(complaint.priority, expected[index]);
                });
            });

            it('should have the proper effect', function() {
                let expected = ['GENERAL', 'GENERAL'];

                complaints.forEach((complaint, index) => {
                    assert.strictEqual(complaint.effect, expected[index]);
                });
            });

            it('should have the proper receiving water body', function() {
                let expected = ['', ''];

                complaints.forEach((complaint, index) => {
                    assert.strictEqual(complaint.receiving_water, expected[index]);
                });
            });

            it('should have the proper regulated entity', function() {
                let expected = ['GENERIC INCIDENT ZIP CODE 75149', 'MAIN ST PAINT & BODY'];

                complaints.forEach((complaint, index) => {
                    assert.strictEqual(complaint.regulated_entity, expected[index]);
                });
            });

            it('should have the proper county', function() {
                let expected = ['DALLAS', 'FANNIN'];

                complaints.forEach((complaint, index) => {
                    assert.strictEqual(complaint.county, expected[index]);
                });
            });

            it('should have the proper description', function() {
                let expected = ['COMPLAINANT ALLEGED FACILITY IS RELEASING FREON',
                    'COMPLAINANT CONCERNED ABOUT FACILITY PAINTING WITH OPEN DOORS'
                ];

                complaints.forEach((complaint, index) => {
                    assert.strictEqual(complaint.description, expected[index]);
                });
            });

            it('should have the proper comment', function() {
                let expected = ['THIS COMPLAINT HAS BEEN REFERRED TO THE US ENVIRONMENTAL PROTECTION AGENCY',
                    'THIS COMPLAINT DOES NOT MEET THE NECESSARY CRITERIA FOR CONDUCTING A COMPLAINT INVESTIGATION'
                ];

                complaints.forEach((complaint, index) => {
                    assert.strictEqual(complaint.comment, expected[index]);
                });
            });

            it('should have the action taken', function() {
                let expected = ['No data available.', 'No data available.'];

                complaints.forEach((complaint, index) => {
                    assert.strictEqual(complaint.action_taken, expected[index]);
                });
            });




        });


    });

    describe('June 17-18 2016 - 27 complaints', function() {

        let complaints;

        before(async function() {
            const requestParams = createRequestObject(new Date('6/18/16'));

            const complaintLinks = await grabComplaints(requestParams);

            const arrayOfComplaints = await Promise.all(complaintLinks.map((link) => {
                return parseComplaint(link);
            }));

            const databaseInserts = await Promise.all(arrayOfComplaints.map((complaint) => {
                return insertComplaint(complaint);
            }));

            complaints = await Promise.all(arrayOfComplaints.map((complaint) => {
                return db.one(`SELECT * FROM complaints WHERE tracking_number = ${complaint.trackingNumber}`);
            }));

        });

        after(function() {
            wipeTable('complaints');
        });

        describe('Complaints', function() {

            it('should successfully insert into the database', function() {

                complaints.forEach((complaint) => {
                    assert.isDefined(complaint);
                });
            });

            it('should have the proper tracking numbers', function() {

                let expected = [
                    236670,
                    236247,
                    235983,
                    240520,
                    235883,
                    236006,
                    235914,
                    235858,
                    235913,
                    235919,
                    236069,
                    236074,
                    235912,
                    236087,
                    236640,
                    236754,
                    235867,
                    238648,
                    236202,
                    235915,
                    236223,
                    235940,
                    235922,
                    235894,
                    236043,
                    235896,
                    235977
                ];

                complaints.forEach((complaint, index) => {
                    assert.strictEqual(complaint.tracking_number, expected[index]);
                });
            });


            it('should have the proper date received', function() {
                let expected = [
                    new Date('6/17/16'),
                    new Date('6/17/16'),
                    new Date('6/17/16'),
                    new Date('6/17/16'),
                    new Date('6/17/16'),
                    new Date('6/17/16'),
                    new Date('6/17/16'),
                    new Date('6/17/16'),
                    new Date('6/17/16'),
                    new Date('6/17/16'),
                    new Date('6/17/16'),
                    new Date('6/17/16'),
                    new Date('6/17/16'),
                    new Date('6/17/16'),
                    new Date('6/17/16'),
                    new Date('6/17/16'),
                    new Date('6/17/16'),
                    new Date('6/17/16'),
                    new Date('6/17/16'),
                    new Date('6/17/16'),
                    new Date('6/17/16'),
                    new Date('6/18/16'),
                    new Date('6/17/16'),
                    new Date('6/17/16'),
                    new Date('6/17/16'),
                    new Date('6/17/16'),
                    new Date('6/17/16'),
                ];

                complaints.forEach((complaint, index) => {
                    assert.strictEqual(new Date(complaint.date_received).toString(), expected[index].toString());
                });
            });

            it('should have the proper number complaining', function() {
                let expected = [
                    1,
                    3,
                    1,
                    1,
                    1,
                    1,
                    1,
                    1,
                    1,
                    1,
                    1,
                    1,
                    1,
                    1,
                    1,
                    1,
                    1,
                    1,
                    1,
                    1,
                    1,
                    1,
                    1,
                    1,
                    1,
                    1,
                    1
                ];

                complaints.forEach((complaint, index) => {
                    assert.strictEqual(complaint.number_complaining, expected[index]);
                });
            });



            it('should have the proper nature', function() {
                let expected = [
                    'OTHER',
                    'WASTEWATER',
                    'WATER SUPPLY QUALITY',
                    'WATER SUPPLY SERVICE',
                    'OSSF - FIELD OPERATIONS DIVISION ONLY',
                    'MUNICIPAL NON-INDUSTRIAL',
                    'CONSTRUCTION',
                    'MUNICIPAL NON-INDUSTRIAL',
                    'ODOR',
                    'DUST',
                    'MUNICIPAL NON-INDUSTRIAL',
                    'STORMWATER',
                    'OTHER',
                    'WASTEWATER',
                    'OTHER',
                    'LANDSCAPE IRRIGATION - COMPLIANCE SUPPORT DIV ONLY',
                    'DUST',
                    'SMOKE',
                    'OTHER',
                    'MUNICIPAL NON-INDUSTRIAL',
                    'OUTDOOR BURNING',
                    'LANDSCAPE IRRIGATION - COMPLIANCE SUPPORT DIV ONLY',
                    'WATER SUPPLY QUALITY',
                    'SMOKE',
                    'DUST',
                    'DISINFECTION RESIDUAL',
                    'ODOR'
                ];

                complaints.forEach((complaint, index) => {
                    assert.strictEqual(complaint.nature, expected[index]);
                });
            });

            it('should have the proper duration', function() {
                let expected = [
                    'ACTUAL',
                    '',
                    '',
                    '',
                    '',
                    '',
                    'ESTIMATED',
                    '',
                    'ESTIMATED',
                    'ESTIMATED',
                    'ESTIMATED',
                    'ESTIMATED',
                    'ESTIMATED',
                    'ESTIMATED',
                    'ACTUAL',
                    'ESTIMATED',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    'ESTIMATED',
                    '',
                    '',
                    ''
                ];

                complaints.forEach((complaint, index) => {
                    assert.strictEqual(complaint.duration, expected[index]);
                });
            });

            it('should have the proper media', function() {
                let expected = [
                    'WATER',
                    'WATER',
                    'WATER',
                    'WATER',
                    'WATER',
                    'WASTE',
                    'WATER',
                    'WASTE',
                    'AIR',
                    'AIR',
                    'WATER',
                    'WATER',
                    'WATER',
                    'WATER',
                    'AIR',
                    'WATER',
                    'AIR',
                    'AIR',
                    'WATER',
                    'WASTE',
                    'AIR',
                    'WATER',
                    'WATER',
                    'AIR',
                    'WASTE',
                    'WATER',
                    'WASTE'
                ];

                complaints.forEach((complaint, index) => {
                    assert.strictEqual(complaint.media, expected[index]);
                });
            });

            it('should have the proper program', function() {
                let expected = [
                    'WATER QUALITY - HIGH LEVEL',
                    'WATER QUALITY - HIGH LEVEL',
                    'PUBLIC WATER SYSTEM/SUPPLY',
                    'PUBLIC WATER SYSTEM/SUPPLY',
                    'WATER QUALITY - HIGH LEVEL',
                    'MUNICIPAL SOLID WASTE - HIGH LEVEL',
                    'WATER QUALITY - HIGH LEVEL',
                    'INDUSTRIAL AND HAZARDOUS WASTE - HIGH LEVEL',
                    'AIR QUALITY - HIGH LEVEL',
                    'AIR QUALITY - HIGH LEVEL',
                    'WATER QUALITY - HIGH LEVEL',
                    'WATER QUALITY - HIGH LEVEL',
                    'WATER QUALITY - HIGH LEVEL',
                    'WATER QUALITY - HIGH LEVEL',
                    'AIR QUALITY - HIGH LEVEL',
                    'WATER QUALITY - HIGH LEVEL',
                    'AIR QUALITY - HIGH LEVEL',
                    'AIR QUALITY - HIGH LEVEL',
                    'WATER QUALITY - HIGH LEVEL',
                    'MUNICIPAL SOLID WASTE - HIGH LEVEL',
                    'AIR QUALITY - HIGH LEVEL',
                    'OCCUPATIONAL LICENSING - HIGH LEVEL',
                    'PUBLIC WATER SYSTEM/SUPPLY',
                    'AIR QUALITY - HIGH LEVEL',
                    'MUNICIPAL SOLID WASTE - HIGH LEVEL',
                    'PUBLIC WATER SYSTEM/SUPPLY',
                    'MUNICIPAL SOLID WASTE - HIGH LEVEL'
                ];

                complaints.forEach((complaint, index) => {
                    assert.strictEqual(complaint.program, expected[index]);
                });
            });

            it('should have the proper priority', function() {
                let expected = [
                    'Within 30 Calendar Days',
                    'Refer or Do Not Respond',
                    'Within 14 Calendar Days',
                    'Within 30 Calendar Days',
                    'Refer or Do Not Respond',
                    'Refer or Do Not Respond',
                    'Within 30 Calendar Days',
                    'Within 30 Calendar Days',
                    'Within 5 Working Days',
                    'Within 14 Calendar Days',
                    'Refer or Do Not Respond',
                    'Refer or Do Not Respond',
                    'Within 30 Calendar Days',
                    'Refer or Do Not Respond',
                    'Within 30 Calendar Days',
                    'Refer or Do Not Respond',
                    'Within 30 Calendar Days',
                    'Within 30 Calendar Days',
                    'Refer or Do Not Respond',
                    'Within 30 Calendar Days',
                    'Within 30 Calendar Days',
                    'Within 14 Calendar Days',
                    'Within 30 Calendar Days',
                    'Within 30 Calendar Days',
                    'Within 30 Calendar Days',
                    'Within 30 Calendar Days',
                    'Within 30 Calendar Days'
                ];

                complaints.forEach((complaint, index) => {
                    assert.strictEqual(complaint.priority, expected[index]);
                });
            });

            it('should have the proper effect', function() {
                let expected = [
                    'ENVIRONMENTAL GENERAL',
                    'HEALTH PROPERTY',
                    'ENVIRONMENTAL',
                    'ENVIRONMENTAL GENERAL',
                    'ENVIRONMENTAL',
                    'ENVIRONMENTAL',
                    'ENVIRONMENTAL',
                    'ENVIRONMENTAL',
                    'ENVIRONMENTAL',
                    'ENVIRONMENTAL',
                    'ENVIRONMENTAL',
                    'ENVIRONMENTAL',
                    'ENVIRONMENTAL',
                    'ENVIRONMENTAL',
                    'ENVIRONMENTAL',
                    'ENVIRONMENTAL',
                    'PROPERTY',
                    'ENVIRONMENTAL PROPERTY CHRONIC',
                    'ENVIRONMENTAL',
                    'ENVIRONMENTAL',
                    'GENERAL',
                    'ENVIRONMENTAL',
                    'ENVIRONMENTAL',
                    'ENVIRONMENTAL OIL AND GAS',
                    'ENVIRONMENTAL',
                    'GENERAL',
                    'ENVIRONMENTAL GENERAL'
                ];

                complaints.forEach((complaint, index) => {
                    assert.strictEqual(complaint.effect, expected[index]);
                });
            });

            it('should have the proper receiving water body', function() {
                let expected = [
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    'Camp Creek',
                    '',
                    'Oyster Creek above Tidal',
                    '',
                    '',
                    '',
                    'NONE',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    'CARSON CREEK'
                ];

                complaints.forEach((complaint, index) => {
                    assert.strictEqual(complaint.receiving_water, expected[index]);
                });
            });

            it('should have the proper regulated entity', function() {
                let expected = [
                	'A C PIT',
                	'CITY OF BUDA WWTP',
                	'CITY OF IRVING',
                	'CITY OF OVERTON',
                	'GENERIC INCIDENT ZIP CODE 77049',
                	'GENERIC INCIDENT ZIP CODE 77050',
                	'GENERIC INCIDENT ZIP CODE 77316',
                	'GENERIC INCIDENT ZIP CODE 77360',
                	'GENERIC INCIDENT ZIP CODE 77365',
                	'GENERIC INCIDENT ZIP CODE 77365',
                	'GENERIC INCIDENT ZIP CODE 77372',
                	'GENERIC INCIDENT ZIP CODE 77378',
                	'GENERIC INCIDENT ZIP CODE 77385',
                	'GENERIC INCIDENT ZIP CODE 77583',
                	'GENERIC INCIDENT ZIP CODE 78501',
                	'GENERIC INCIDENT ZIP CODE 78676',
                	'GENERIC INCIDENT ZIP CODE 78751',
                	'GENERIC INCIDENT ZIP CODE 79108',
                	'GENERIC INCIDENT ZIP CODE 79512',
                	'JARRELL RECYCLING',
                	'JERRY WOMACK RESIDENCE',
                	'MERRILL HALL',
                	'PRAIRIE GROVE WSC',
                	'SAN PEDRO RANCH CTB 10',
                	'SOUTH ASPHALT PLANT 1',
                	'STEELE CREEK ACRES',
                	'WHITTLESEY LANDSCAPE SUPPLY'
                ];

                complaints.forEach((complaint, index) => {
                    assert.strictEqual(complaint.regulated_entity, expected[index]);
                });
            });

            it('should have the proper county', function() {
                let expected = [
                'HIDALGO',
                'HAYS',
                'DALLAS',
                'RUSK',
                'HARRIS',
                'HARRIS',
                'MONTGOMERY',
                'POLK',
                'MONTGOMERY',
                'MONTGOMERY',
                'MONTGOMERY',
                'MONTGOMERY',
                'MONTGOMERY',
                'BRAZORIA',
                'HIDALGO',
                'HAYS',
                'TRAVIS',
                'POTTER',
                'MITCHELL',
                'WILLIAMSON',
                'HUNT',
                'DALLAS',
                'ANGELINA',
                'DIMMIT',
                'HAYS',
                'BOSQUE',
                'TRAVIS'
                ];

                complaints.forEach((complaint, index) => {
                    assert.strictEqual(complaint.county, expected[index]);
                });
            });

            it('should have the proper description', function() {
                let expected = [
                	'Complainant is concerned that business is operating without a registration from the state. Entity is excavating and selling dirt product and has been operating approximately one month.',
                	'Complainant indicates the facility is discharging waste water onto private property.',
                	'Complainant alleges sand, decaying organic matter, metal shavings showing up in the aeration screen of bathroom faucet.',
                	'The TCEQ Tyler Regional Office received a complaint on June 17, 2016, regarding a water leak in Rusk Co.',
                	'The complainant alleges there is sewage coming from a septic system and flowing into their yard.',
                	'Complainant alleges that company overuses and over sprays pesticides.',
                	`Complainant states that the construction site across the street from their property is releasing silt and discolored water onto their property, and into their private lake, especially after the recent flooding event, which caused the construction site's detention pond to breach and release tons of sediment into the creek and private lake.`,
                	'COMPLAINANT REPORTED 100 OR MORE TIRES DISPOSED IN A RAVINE BEHIND FACILITY AND OIL SPILLAGE. COMPLAINANT WORKING CRIMINAL CHARGES, BUT REQUESTED ASSISTANCE REGARDING OIL SPILLAGE.',
                	'The Complainant alleged impacts of odor coming from a business in the area.',
                	'The Complainant is concerned about dust coming from a business in the area.',
                	'Allegedly, home builders are digging holes on newly cleared lots and dumping building materials and paint into them. They are burning the material dumped into these holes and they are also burying the materials in these holes after the home is built.',
                	'A home builder is causing tracking of dirt onto the road. Fill dirt is being brought in for the construction of homes, but there are no controls to prevent the dirt from running off into the streets and into the drainage system. This is causing the street to flood.',
                	`Complainant states that the contractors of a new neighborhood have dug a ditch, that routes stormwater from the construction site and flows adjacent to complainant's private property, and has been creating swamp like conditions.`,
                	'Someone has been dumping horse manure and urine soaked horse bedding into the floodway easement for the past five months.',
                	'Complainant is stating that a painting buisness is placing paints on sidewalk and is contaminating.',
                	'Complainant indicates that a golf course is watering in the middle of the day.',
                	'Complainant alleges dust from a nearby demolition project is causing a nuisance',
                	`COMPLAINANT ALLEGES SMOKE COMING FROM NEIGHBOR'S GRILL IS INTERFERING WITH DAILY ACTIVITIES.`,
                	'A complainant alleges a septic system in Mitchell County was installed without a permit.',
                	'Complainant alleges that recycling facility is accumulating an increasingly large amount of unprocessed scrap metal.',
                	'COMPLAINANT ALLEGE BURNING AT NEAR BY PROPERTY',
                	'The Program Support Section (PSS), Texas Commission on Environmental Quality (TCEQ), received a complaint Incident # 235940 on 06/20/2016. The complainant alleges that the irrigator is advertising without a license.',
                	'THE COMPLAINANT STATED THAT THEY FILLED THEIR POOL AND THE WATER IS A GREEN COLOR WITH A RED TAR LIKE SUBSTANCE ON THE EDGE. THE WATER IS ALSO OFTEN BROWN IN COLOR AND THE CHLORINE IS NOT CONSTANT.',
                	'On June 17, 2016, the Texas Commission on Environmental Quality Laredo Regional Office received complaint.',
                	'Complainant alleged to have seen large cloud of emissions from a nearby facility.',
                	'The complainant states that their drinking water is overly chlorinated.',
                	'Complainant alleges odor and unauthorized discharge from a nearby facility.'
                ];	

                complaints.forEach((complaint, index) => {
                    assert.strictEqual(complaint.description, expected[index]);
                });
            });

            it('should have the proper comment', function() {
                let expected = [
                'More information will be available upon approval of the investigation report.',
                'This complaint does not meet the necessary criteria for conducting a complaint investigation.',
                'More information will be available upon approval of the investigation report.',
                'More information will be available upon approval of the investigation report.',
                'This complaint has been referred to the Harris County Office of Public Infrastructure. Contact information for the agency is 713-956-3000.',
                'This complaint has been referred to the City of Houston Environmental Crimes Unit.',
                'More information will be available upon approval of the investigation report.',
                'THIS COMPLAINT HAS BEEN REFERRED TO THE ONALASKA FIRE MARSHALL. ASSISTANCE WAS PROVIDED AS REQUESTED.',
                'This complaint has been assigned and will be further investigated by an Environmental Investigator.',
                'More information will be available upon approval of the investigation report.',
                'This complaint has been referred to the City of Patton Village Police Department. Contact information for the police department is 832-476-8495.',
                'This complaint has been referred to the Montgomery County Department of Environmental Health. Contact information for the agency is (936) 539-7839.',
                'More information will be available upon approval of the investigation report.',
                'This complaint has been referred to the Texas State Soil and Water Conservation Board. Contact information for the agency is 979-532-9496.',
                'More information will be availabe upon approval of the investigation report.',
                'This complaint does not meet the necessary criteria for conducting a complaint investigation.',
                'More information will be available upon approval of the investigation report.',
                'MORE INFORMATION WILL BE AVAILABLE UPON APPROVAL OF THE INVESTIGATION REPORT.',
                'This complaint has been referred to Bennie Marricle, DR of Mitchell County. Contact information for the agency representative is PO Box 1001, Colorado City, Texas 79512-1001.',
                'More information will be available upon approval of the investigation report.',
                'MORE INFORMATION WILL BE AVAILABLE UPON APPROVAL OF THE INVESTIGATION REPORT',
                'More information will be available upon approval of the investigation report.',
                'MORE INFORMATION WILL BECOME AVAILABLE UPON APPROVAL OF THE INVESTIGATION REPORT.',
                'More information will be available upon approval of the investigation report.',
                'More information will be available upon approval of the investigation report.',
                'More information will be available upon approval of the investigation report.',
                'More information will be available upon approval of the investigation report.'
                ];

                complaints.forEach((complaint, index) => {
                    assert.strictEqual(complaint.comment, expected[index]);
                });
            });

            it('should have the action taken', function() {
                let expected = [
                	'This complaint has been assigned and will be further investigated by an Environmental Investigator.',
                	'No data available.',
                	'This complaint has been assigned and will be further investigated by an Environmental Investigator.',
                	'This complaint has been assigned and will be further investigated by an Environmental Investigator.',
                	'The complainant has been contacted regarding the referral of this complaint.',
                	'No data available.',
                	'This complaint has been assigned and will be further investigated by an Environmental Investigator.',
                	'THIS COMPLAINT HAS BEEN REFERRED TO THE ONALASKA FIRE MARSHALL.',
                	'No data available.',
                	'This complaint has been assigned and will be further investigated by an Environmental Investigator.',
                	'The complainant has been contacted regarding the referral of this complaint.',
                	'The complainant has been contacted regarding the referral of this complaint.',
                	'This complaint has been assigned and will be further investigated by an Environmental Investigator.',
                	null,
                	'This complaint has been assigned and will be further investigated by an Environmental Investigator.',
                	'No data available.',
                	'This complaint has been assigned and will be further investigated by an Environmental Investigator.',
                	'THIS COMPLAINT HAS BEEN ASSIGNED AND WILL BE FURTHER INVESTIGATED BY AN ENVIRONMENTAL INVESTIGATOR.',
                	'The complainant has been contacted regarding the referral of this complaint.',
                	'This complaint has been assigned and will be further investigated by an Environmental Investigator.',
                	'THIS COMPLAINT HAS BEEN ASSIGNED AND WILL BE FURTHER INVESTIGATED BY AN ENVIRONMENTAL INVESTIGATOR',
                	'This complaint has been assigned and will be further investigated by an Environmental Investigator.',
                	'THIS COMPLAINT HAS BEEN ASSIGNED AND WILL BE FURTHER INVESTIGATED BY AN ENVIRONMENTAL INVESTIGATOR.',
                	'The complaint has been assigned and will be further investigated by an Environmental Investigator.',
                	'This complaint has been assigned and will be further investigated by an Environmental Investigator.',
                	'This complaint has been assigned and will be further investigated by an Environmental Investigator.',
                	'This complaint has been assigned and will be further investigated by an Environmental Investigator.'
                ];

                complaints.forEach((complaint, index) => {
                    assert.strictEqual(complaint.action_taken, expected[index]);
                });
            });




        });


    });
});
