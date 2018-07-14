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

	/* in-file */
	;

function help() {
	console.log(fs.readFileSync(path.join(__dirname, './help.txt'), 'utf8'));
}

function list(conn, options) {
	conn.findObjects(options, (err, objects) => {
		if (err) {
			err.print ? err.print() : console.log(err.message);
			return;
		}
		if (!objects) {
			console.log('No objects found.');
			return;
		}

		objects.forEach(obj => {
			if (obj.subdir) {
				console.log('+', obj.subdir);
			}
			else {
				console.log('.', obj.name);
			}
		});
	});
}

function run(argv) {
	const groups = [ 
		[ 
			'--help -h [*:=*help] REQUIRED', 
		], [
			'--connection -c REQUIRED',
			'--container -C NOT NULLABLE',
			'--path NOT NULLABLE',
			'--prefix NOT NULLABLE',
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
		const connJson = JSON.parse(fs.readFileSync(cmd.connection, 'utf8'));
		if (cmd.container) {
			connJson.container = cmd.container;
		}
		const conn = ceph.createConnection(connJson);

		let options = {};
		if (cmd.path) options.path = cmd.path;
		if (cmd.prefix) options.prefix = cmd.prefix;
		list(conn, options);
	}
}

run.desc = 'Find objects in remote CEPH storage.';

module.exports = run;