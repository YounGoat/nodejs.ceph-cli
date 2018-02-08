'use strict';

const MODULE_REQUIRE = 1
	/* built-in */
	, fs = require('fs')
	
	/* NPM */
	, noda = require('noda')
	
	/* in-package */
	;

/**
 * Command entrance.
 * @param  {string[]}  argv          command line arguments
 * @param  {Object}    options    
 * @param  {string[]}  options.names command and sub command names
 */
function man(argv, options) {
	let commandName = options.names.join(' ');

	let commandBaseDir = 'command';
	for (let i = 1; i < options.names.length; i++) {
		commandBaseDir = `${commandBaseDir}/${options.names[i]}/command`;
	}

	let subcommand = null;
	if (argv.length && !argv[0].startsWith('-')) {
		subcommand = argv.shift();
	}

	// Subcommand "help" is a virtual one.
	if (subcommand == 'help') {
		subcommand = argv[0];
		argv[0] = 'help';
	}

	if (subcommand) {
		if (!noda.inExists(`${commandBaseDir}/${subcommand}`, true)) {
			console.error(`sub command not found: ${subcommand}`);
		}
		else {
			noda.inRequire(`${commandBaseDir}/${subcommand}`)(argv);
		}
	}
	else {
		let names = fs.readdirSync(noda.inResolve(commandBaseDir));
		console.log();
		console.log('NAME');
		console.log(`\t${commandName} - ${options.desc}`);
		console.log();
		console.log('SYNOPSIS');
		console.log(`\t${commandName} help <sub-command-name>`);
		console.log('\tShow help info of specified sub command.');
		console.log();
		names.forEach((name) => {
			name = name.replace(/\.js$/, '');
			let run = null;
			try {
				run = noda.inRequire(`${commandBaseDir}/${name}`);
				console.log(`\t${commandName} ${name}`);
				if (run.desc) {
					console.log(`\t${run.desc}`);
				}
				console.log();
			} catch (error) {
				// DO NOTHING.
				// Ignore invalid directory/file.
			}
		});
		console.log();
	}
}

module.exports = man;