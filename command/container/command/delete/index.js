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
	, commandContainerClear = noda.inRequire('command/container/command/clear')
	;

function help() {
	console.log(fs.readFileSync(path.join(__dirname, './help.txt'), 'utf8'));
}

function catcher(err) {
	err.print ? err.print() : console.log(err.message);
	process.exit(1);
}

function clearAndRemoveContainer(conn, containerName) {
	commandContainerClear.clear(conn, containerName, (err) => {
		if (err) catcher(err);
		else removeContainer(conn, containerName);
	});
}

function removeContainer(conn, containerName) {
	conn.deleteContainer(containerName)
		.then(() => console.log(`Container "${containerName}" deleted from CEPH storage.`))
		.catch(catcher);
}

function run(argv) {
	const groups = [ 
		[ 
			'--help -h [*:=*help] REQUIRED', 
		], [
			'--name --container -n -C [0] REQUIRED',
			'--connection -c REQUIRED',
			'--force NOT ASSIGNABLE',
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
		const conn = ceph.createConnection(connJson);

		if (cmd.force) {
			clearAndRemoveContainer(conn, cmd.name);
		}
		else {
			removeContainer(conn, cmd.name);
		}	
	}
}

run.desc = 'Create new container on remote CEPH storage.';

module.exports = run;