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

function list(connPathname, containerName) {
	const connJson = JSON.parse(fs.readFileSync(connPathname, 'utf8'));
	const conn = ceph.createConnection(connJson);
	conn.findContainers()
		.then(data => {
			data.forEach(meta => {
				console.log(meta.name);
			});
		})
		.catch(err => {
			err.print ? err.print() : console.log(err.message);
		});
}

function run(argv) {
	const groups = [ 
		[ 
			'--help -h [*:=*help] REQUIRED', 
		], [
			'--connection -c REQUIRED',
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
		list(cmd.connection, cmd.name);
	}
}

run.desc = 'List containers on remote CEPH storage.';

module.exports = run;