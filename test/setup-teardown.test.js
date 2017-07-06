'use strict';

//Tell Node not to freak out when I don't catch promise
//rejections in tests
process.on('unhandledRejection', function(reason, p) {
    return;
});

import { pgp } from '../src/dbConnect';

after(function() {
    pgp.end();
});
