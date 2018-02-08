#!/usr/bin/env node

'use strict';

const MODULE_REQUIRE = 1
    /* built-in */
    , fs = require('fs')
    
    /* NPM */
    , noda = require('noda')
    
    /* in-package */
    , man = noda.inRequire('lib/man')
    ;
    

man(process.argv.slice(2), {
    names: [ 'ceph' ],
    desc: 'Admin CEPH storage via command line interface.',
});

// let argv = process.argv.slice(2);
// let command = null;
// if (argv.length && !argv[0].startsWith('-')) {
//     command = argv.shift();
// }

// if (command == 'help') {
//     command = argv[0];
//     argv[0] = 'help';
// }

// if (command) {
//     if (!noda.inExists(`command/${command}`, true)) {
//         console.error(`sub command not found: ${command}`);
//     }
//     else {
//         noda.inRequire(`command/${command}`)(argv);
//     }
// }
// else {
//     let names = fs.readdirSync(noda.inResolve('command'));
//     console.log();
//     console.log('NAME');
//     console.log('\tceph - Admin CEPH storage via command line interface.');
//     console.log();
// 	console.log('SYNOPSIS');
// 	console.log('\tceph help <sub-command-name>');
// 	console.log('\tShow help info of specified sub command.');
// 	console.log();
//     names.forEach((name) => {
//         name = name.replace(/\.js$/, '');
//         let run = null;
//         try {
//             run = noda.inRequire(`command/${name}`);            
//             console.log(`\tceph ${name}`);
//             if (run.desc) {
//                 console.log(`\t${run.desc}`);
//             }
//             console.log();
//         } catch (error) {
//             // DO NOTHING.
//             // Ignore invalid directory/file.
//         }
//     });
//     console.log();
// }