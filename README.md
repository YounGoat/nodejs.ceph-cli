#	ceph-cli
__CEPH command line interface__

##	Table of contents

*	[Get Started](#get-started)
* 	[Sub Commands](#sub-commands)
*	[About](#about)
*	[References](#references)

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

The following sub commands are avaiable under command `ceph`:
*	create-container
*	download
*	upload

##  About

##  References