'use strict';

const MODULE_REQUIRE = 1
	/* built-in */
	, fs = require('fs')
	, path = require('path')
	
	/* NPM */
	, ceph = require('ceph')
	, commandos = require('commandos')
	
	/* in-package */

	/* in-file */
	;

function help() {
	console.log(fs.readFileSync(path.join(__dirname, './help.txt'), 'utf8'));
}

function info(conn, container, name) {
	let p;
	if (name) {
		p = conn.readObjectMeta({ container,  name });
	}
	else {
		p = conn.readContainer({ name: container });
	}
	
	p.then(meta => {
		console.log(meta);
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
			'--name -n NOT NULLABLE',
			'--container -C NOT NULLABLE',
			'--connection -c REQUIRED',
			'--verbose -v NOT ASSIGNABLE',
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
		info(conn, cmd.container, cmd.name);
	}
}

run.desc = 'Display meta data of container or object.';

module.exports = run;