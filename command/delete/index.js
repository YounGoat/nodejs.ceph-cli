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

function batchRemove(conn, prefix) {
	function catcher(err) {
		err.print ? err.print() : console.log(err.message);
		process.exit(1);
	}

	let run = () => {
		let counter = 0;
		conn.findObjects({ prefix, limit: 100 })
			.then(data => {
				counter = data.length;
				if (counter == 0) {
					// 已清空。
					console.log(`Objects prefixed with ${prefix} deleted from CEPH storage.`);
				}
				else {
					let I = 0;
					data.forEach(meta => {
						conn.deleteObject({
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

function remove(conn, cephName) {
	conn.deleteObject(cephName)
		.then(() => console.log('Object deleted from CEPH storage.'))
		.catch(err => err.print ? err.print() : console.log(err.message));
}

function run(argv) {
	const groups = [ 
		[ 
			'--help -h [*:=*help] REQUIRED', 
		], [
			'--name -n REQUIRED',
			'--connection -c REQUIRED',
			'--container -C NOT NULLABLE',
		], [
			'--prefix REQUIRED',
			'--connection -c REQUIRED',
			'--container -C NOT NULLABLE',
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
		if (!conn.get('container')) {
			console.error('Container is missed.');
			return;
		}

		if (cmd.prefix) {
			batchRemove(conn, cmd.prefix);
		}
		else {
			remove(conn, cmd.name);
		}
	}
}

run.desc = 'Delete file (object) from remote CEPH storage. ';

module.exports = run;