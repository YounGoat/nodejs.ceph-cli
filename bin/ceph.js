#!/usr/bin/env node

'use strict';

const MODULE_REQUIRE = 1
    /* built-in */
    , fs = require('fs')
    
    /* NPM */
    , noda = require('noda')
    
    /* in-package */
    , man = noda.inRequire('lib/man')
    , alias = noda.inRequire('alias')
    ;

let argv = process.argv.slice(2);
for (let i = 0; i < alias.length; i++) {
    const [ newargv, oldargv ] = alias[i];
    let matched = (argv.length >= newargv.length);
    for (let j = 0; matched && j < newargv.length; j++) {
        matched = (argv[j] == newargv[j]);
    }
    if (matched) {
        argv = oldargv.concat(argv.slice(newargv.length));
        break;
    }
}

man(argv, {
    names: [ 'ceph' ],
    alias,
    desc: 'Admin CEPH storage via command line interface.',
});