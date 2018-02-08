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

function download(conn, cephName, filePathname, verbose) {
	const callback = (err) => {
		if (err) err.print ? err.print() : console.log(err.message);
		else if (filePathname) console.log(`Object downloaded to ${filePathname}`);	
	};
	let output = filePathname ? fs.createWriteStream(filePathname) : process.stdout;
	conn.pullObject(cephName, callback)
		.on('error', () => 0)
		.on('meta', (meta) => {
			if (verbose) {
				for (let name in meta) {
					console.log('>', name, ':', meta[name]);
				}
				console.log();
			}
		})
		.on('end', () => console.log())
		.pipe(output);
}

function run(argv) {
	const groups = [ 
		[ 
			'--help -h [*:=*help] REQUIRED', 
		], [
			'--file -f',
			'--name REQUIRED NOT NULLABLE',
			'--container NOT NULLABLE',
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
		if (cmd.file) {
			cmd.file = path.resolve(cmd.file);
			mkdirp(path.dirname(cmd.file));
		}

		const connJson = JSON.parse(fs.readFileSync(cmd.connection, 'utf8'));
		if (cmd.container) {
			connJson.container = cmd.container;
		}
		const conn = ceph.createConnection(connJson);

		download(conn, cmd.name, cmd.file, cmd.verbose);
	}
}

run.desc = 'Download object from remote ceph storage and save as local file.';

module.exports = run;