# e2e-orbitDB-chat-app-prototype
This is a simple example application demonstrating how to
use [OrbitDB](https://github.com/orbitdb/orbit-db) and [IPFS](https://ipfs.io/)
to create a chat application.

The example is composed of two node.js JavaScript files.
A [master-node](./ChatMaster-Node/master-node.js) is started with a direct connection
to the internet (no firewall). Any number
of [client-nodes](./ChatClient-Node/client.js) can be started to join the 'chat room'.
Each client needs to set its `MASTER_MULTIADDR` and `DB_ADDRESS` in order to connect.

This example will be improved upon in order to build a full-featured,
browser-based, end-to-end (e2e) encrypted chat application.

The encryption layer is still being explored, but unless a better solution is
found, the [cli-encrypt](https://www.npmjs.com/package/cli-encrypt) library
can be used.

## License
[MIT](LICENSE.md)
