'use strict';

const MODULE_REQUIRE = 1
	/* built-in */
	, fs = require('fs')
	, path = require('path')
	
	/* NPM */
	, ceph = require('ceph')
	, commandos = require('commandos')
	, noda = require('noda')
	
	/* in-package */
	;

function help() {
	console.log(fs.readFileSync(path.join(__dirname, './help.txt'), 'utf8'));
}

function create(connPathname, name, meta) {
	const connJson = JSON.parse(fs.readFileSync(connPathname, 'utf8'));
	const conn = ceph.createConnection(connJson);
	const options = { name, meta }; 
	conn.createContainer(options)
		.then(() => console.log(`New container "${name}" created on CEPH storage.`))
		.catch(err => err.print ? err.print() : console.log(err.message));
}

function run(argv) {
	const groups = [ 
		[ 
			'--help -h [*:=*help] REQUIRED', 
		], [
			'--name --container -n -C [0] REQUIRED',
			'--connection -c REQUIRED',
			'--meta-* NOT NULL',
		]
	];
	const cmd = commandos.parse([ 'foo' ].concat(argv), { groups, catcher: help });
	
	if (!cmd) {
		return;
	}
	else if (cmd.help) {
		return help();
	}
	else {
		create(cmd.connection, cmd.name, cmd.meta);
	}
}

run.desc = 'Create new container on remote CEPH storage.';

module.exports = run;