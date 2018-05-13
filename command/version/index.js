'use strict';

const MODULE_REQUIRE = 1
	/* built-in */
	
	/* NPM */
	, commandos = require('commandos')
	, noda = require('noda')
	
	/* in-package */

	/* in-file */
	;

function help() {
	console.log(fs.readFileSync(path.join(__dirname, './help.txt'), 'utf8'));
}

function version() {
	console.log(`ceph: v${noda.packageOf('ceph', module).version}`);
	console.log(`ceph-cli: v${noda.currentPackage().version}`);
}

function run(argv) {
	const groups = [ 
		[ 
			'--help -h [*:=*help] REQUIRED', 
		], [
		]
	];
	const cmd = commandos.parse.onlyArgs(argv, { groups, catcher: help });
	
	if (!cmd) {
		return;
	}
	else if (cmd.help) {
		return help();
	}
	else {
		version();
	}
}

run.desc = 'Display version info.';

module.exports = run;