#	ceph-cli
__CEPH command line interface__

Help you easily managing your CEPH storage.

##	Table of contents

*	[Get Started](#get-started)
* 	[Sub Commands](#sub-commands)
*	[Recommendations](#recommendations)

##	Links

*	[CHANGE LOG](./CHANGELOG.md)
*	[Homepage](https://github.com/YounGoat/nodejs.ceph-cli)

##	Get Started

```bash
# After installation, a global command "ceph" will be available.
npm install -g ceph-cli

# List available sub commands.
ceph 

# Show help info of sub command.
ceph help download

# Download object from CEPH storage and save into local file.
ceph upload --file foo.txt --name my/foo --connection conn.json
```

Here `conn.json` is a JSON formatted file which contains necessary connection configuration to a remote CEPH storage. See [osapi README / OpenStack Swift Style](https://github.com/YounGoat/nodejs.osapi#openstack-swift-style) for an example.

##	Sub Commands

The following sub commands or command-sets are avaiable under command `ceph`:
*	__container__  
	To manage the containers.
	-	__clear__
	-	__create__
	-	__delete__
	-	__list__

*	__delete__  
	To delete an object.

*	__download__  
	To download an object to local file system.

*	__info__  
	Display meta data of container or object.

*	__list__  
	To list/find objects.

*	__rename__  
	Rename an existing object.

*	__upload__  
	To create an object with content in the specified file.

1.	Run `ceph` to print main manual page.
1.	Run `ceph <subset-name>` to print manual page for sub command set.

##  Recommendations

*   [ceph](https://www.npmjs.com/package/ceph)
*   [ceph-agent](https://www.npmjs.com/package/ceph-agent)
*   [ceph-cli](https://www.npmjs.com/package/ceph-cli)
*   [ceph-sync](https://www.npmjs.com/package/ceph-sync)
*   [osapi](https://www.npmjs.com/package/osapi)
