'use strict';

const MODULE_REQUIRE = 1
	/* built-in */
	
	/* NPM */
	, noda = require('noda')	

	/* in-package */
	, man = noda.inRequire('lib/man')
	;


function run(argv) {
	man(argv, {
		names: [ 'ceph', 'container' ],
		desc: run.desc,
	});
}

run.desc = 'Command set to manage object containers.';

module.exports = run;