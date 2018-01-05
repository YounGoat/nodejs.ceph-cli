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

function upload(connPathname, filePathname, cephName) {
	const connJson = JSON.parse(fs.readFileSync(connPathname, 'utf8'));
	const conn = ceph.createConnection(connJson);
	conn.createObject(cephName, fs.createReadStream(filePathname))
		.then(() => console.log('File uploaded to CEPH storage.'))
		.catch(err => err.print ? err.print() : console.log(err.message));
}

function run(argv) {
	const groups = [ 
		[ 
			'--help -h [*:=*help] REQUIRED', 
		], [
			'--file -f REQUIRED',
			'--name REQUIRED',
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
		upload(cmd.connection, cmd.file, cmd.name);
	}
}

run.desc = 'Upload file in local system onto remote CEPH storage.';

module.exports = run;