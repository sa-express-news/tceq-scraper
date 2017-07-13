'use strict';

//Tell Node not to freak out when I don't catch promise
//rejections in tests
process.on('unhandledRejection', function(reason, p) {
    return;
});

import { pgp } from '../src/dbConnect';

describe('test suite', function() {
    after(function() {
        pgp.end();
    });

    require('./tests//utility.test.js');
    require('./tests//mailer.test.js');
    require('./tests//complaintParser.test.js');
    require('./tests//complaintGrabber.test.js');
    require('./tests//database.test.js');
    require('./tests//integrations.test.js');
    require('./tests//endtoend.test.js');
})
