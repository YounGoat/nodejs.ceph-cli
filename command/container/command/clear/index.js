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
	if (!err) return;
	err.print ? err.print() : console.log(err.message);
	process.exit(1);
}

function clear(conn, options, callback) {
	if (typeof options == 'string') {
		options = { name: options };
	}
	if (!options.concurrency) {
		options.concurrency = 100;
	}
	let retry = /^\d+$/.test(options.retry) ? parseInt(options.retry) : 3;

	if (!callback) callback = catcher;

	let run = () => {
		let counter = 0;
		conn.findObjects({ container: options.name, limit: options.concurrency })
			.then(data => {
				counter = data.length;
				if (counter == 0) {
					// 已清空。
					console.log(`Container "${options.name}" is now clear.`);
					callback();
				}
				else {
					let I = 0;
					data.forEach(meta => {
						// if (I++) return;
						conn.deleteObject({
							container: options.name,
							name: meta.name
						})
						.then(() => {
							console.log(`Object deleted: ${meta.name}`);
							if (--counter == 0) {
								run();
							}
						})
						.catch(ex => {
							if (retry == 0) return callback(ex);
							retry--;
							counter--;
							if (counter == 0) run();
						})
						;
					})
				}
			})
			.catch(ex => {
				if (retry == 0) return callback(ex);
				retry--;
				run();
			})
			;
	};
	run();
}

function run(argv) {
	const groups = [ 
		[ 
			'--help -h [*:=*help] REQUIRED', 
		], [
			'--name --container -n -C [0] REQUIRED',
			'--connection -c REQUIRED',
			'--concurrency --co NOT NULL',
			'--retry NOT NULL',
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

		clear(conn, { 
			name: cmd.name, 
			concurrency: cmd.concurrency, 
			retry: cmd.retry,
		});
	}
}
run.clear = clear;
run.desc = 'Create new container on remote CEPH storage.';
module.exports = run;