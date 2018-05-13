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

function help(ex) {
	console.log(fs.readFileSync(path.join(__dirname, './help.txt'), 'utf8'));
}

function upload(conn, filePathname, options) {
	conn.createObject(options, fs.createReadStream(filePathname))
		.then(() => console.log('File uploaded to CEPH storage.'))
		.catch(err => err.print ? err.print() : console.log(err.message));
}

function run(argv) {
	const groups = [ 
		[ 
			'--help -h [*:=*help] REQUIRED', 
		], [
			'--file -f REQUIRED',
			'--name -n REQUIRED',
			'--container -C NOT NULLABLE',
			'--connection -c REQUIRED',
			'--content-type NOT NULLABLE',
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

		const options = { name: cmd.name };
		if (cmd['content-type']) {
			options.contentType = cmd['content-type'];
		}

		upload(conn, cmd.file, options);
	}
}

run.desc = 'Upload file in local system onto remote CEPH storage.';

module.exports = run;