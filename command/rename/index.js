'use strict';

const MODULE_REQUIRE = 1
	/* built-in */
	, fs = require('fs')
	, path = require('path')
	
	/* NPM */
	, ceph = require('ceph')
	, commandos = require('commandos')
	, noda = require('noda')
	, undertake = require('undertake')
	
	/* in-package */
	;

function help(ex) {
	console.log(fs.readFileSync(path.join(__dirname, './help.txt'), 'utf8'));
}

function rename(conn, source, target) {
	undertake(function*() {
		yield conn.copyObject(source, target);
		yield conn.deleteObject(source);
		console.log(`"${source}" renamed to "${target}".`);
	}).catch(err => err.print ? err.print() : console.log(err.message));
}

function run(argv) {
	const groups = [ 
		[ 
			'--help -h [*:=*help] REQUIRED', 
		], [
			'--from NOT NULLABLE REQUIRED',
			'--to NOT NULLABLE REQUIRED',
			'--connection -c REQUIRED',
			'--container -C NOT NULLABLE',
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
		const connJson = JSON.parse(fs.readFileSync(cmd.connection, 'utf8'));
		if (cmd.container) {
			connJson.container = cmd.container;
		}
		const conn = ceph.createConnection(connJson);
		rename(conn, cmd.from, cmd.to);
	}
}

run.desc = 'Rename an existing object.';

module.exports = run;