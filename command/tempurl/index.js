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
	, mkdirp = (pathname) => {
        // 如果目录已经存在，则什么都不需要做。
        if (!fs.existsSync(pathname)) {    
            // 如果上一级目录不存在，则递归创建之。
            var parent = path.resolve(pathname, '..');
            if (!fs.existsSync(pathname)) mkdirp(parent);    
            // 创建目录。
            fs.mkdirSync(pathname);
        }
    }
	;

function help() {
	console.log(fs.readFileSync(path.join(__dirname, './help.txt'), 'utf8'));
}

function printTempURL(conn, cephName) {
	conn.generateTempUrl(cephName, (err, tempurl) => {
		if (err) {
			console.error(err.message);
		}
		else {
			console.log(tempurl);
		}
	});
}

function run(argv) {
	const groups = [ 
		[ 
			'--help -h [*:=*help] REQUIRED', 
		], [
			'--name -n REQUIRED NOT NULLABLE',
			'--container -C NOT NULLABLE',
			'--connection -c REQUIRED',
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

		printTempURL(conn, cmd.name);
	}
}

run.desc = 'Generate temporary HTTP URL.';

module.exports = run;