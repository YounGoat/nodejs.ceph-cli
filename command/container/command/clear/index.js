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

function catcher(err) {
	err.print ? err.print() : console.log(err.message);
	process.exit(1);
}

function clear(conn, containerName) {
	let run = () => {
		let counter = 0;
		conn.findObjects({ container: containerName, limit: 100 })
			.then(data => {
				counter = data.length;
				if (counter == 0) {
					// 已清空。
					console.log(`Container "${containerName}" is now clear.`);
				}
				else {
					let I = 0;
					data.forEach(meta => {
						// if (I++) return;
						conn.deleteObject({
							container: containerName,
							name: meta.name
						})
						.then(() => {
							console.log(`Object deleted: ${meta.name}`);
							if (--counter == 0) {
								run();
							}
						})
						.catch(catcher)
						;
					})
				}
			})
			.catch(catcher)
			;
	};
	run();
}

function run(argv) {
	const groups = [ 
		[ 
			'--help -h [*:=*help] REQUIRED', 
		], [
			'--name --container [0] REQUIRED',
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
		const connJson = JSON.parse(fs.readFileSync(cmd.connection, 'utf8'));
		const conn = ceph.createConnection(connJson);

		clear(conn, cmd.name);
	}
}

run.desc = 'Create new container on remote CEPH storage.';

module.exports = run;