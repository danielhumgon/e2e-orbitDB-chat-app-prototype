'use strict'

// CUSTOMIZE THESE VARIABLES
const DB_NAME = "example5343234"

const IPFS = require('ipfs')
const OrbitDB = require('orbit-db')
let userName = 'Node1';
let aux = true;

// Ipfs options
const ipfsOptions = {
  repo: './orbitdb/examples/ipfs',
  start: true,
  EXPERIMENTAL: {
    pubsub: true,
  },
  config: {
    Addresses: {
      Swarm: [
        '/ip4/0.0.0.0/tcp/5004',
        '/ip4/190.198.70.169/tcp/5005/ws'
      ],
      API: '/ip4/190.198.70.169/tcp/5006',
      Gateway: '/ip4/190.198.70.169/tcp/5007',
      Delegates: []
    },
  },
  relay: {
    enabled: true, // enable circuit relay dialer and listener
    hop: {
      enabled: true // enable circuit relay HOP (make this node a relay)
    }
  },
  pubsub: true
}


const printChat = async (db) => {
  console.clear();
  const latest = db.iterator({ limit: 6 }).collect()
  let output = ``
  output += `Chat App.\n`
  output += `--------------------\n`
  output += `Username   | Message\n`
  output += `--------------------\n`
  output += latest.map((e) => e.payload.value.userName + ' : ' + e.payload.value.message).join('\n') + `\n`
  output += `\n`;
  output += `--------------------\n`
  output += `${userName} Type Message:`
  console.log(output)

}

// Start ipfs server node
const startMasterNode = async () => {
  console.log("Starting...")
  const ipfs = await IPFS.create(ipfsOptions)

  let db
  try {
    const access = {
      // Give write access to everyone
      write: ["*"]
    };

    const orbitdb = await OrbitDB.createInstance(ipfs, { repo: './orbitdb/examples/eventlog' })
    db = await orbitdb.eventlog(DB_NAME, { accessController: access })
    await db.load()
    console.log(`db id: ${db.id}`)
    db.events.on('replicated', () => {
      if (!aux) { printChat(db); }
    })
  } catch (e) {
    console.error(e)
    process.exit(1)
  }


  // Get process.stdin as the standard input object.
  var standard_input = process.stdin;
  standard_input.setEncoding('utf-8');
  console.log("\n")
  console.log("--------------------\n")
  console.log("Insert Username.");

  var standard_input = process.stdin;

  standard_input.on('data', (data) => {
    // User input exit.
    if (data === 'exit\n') {
      // Program exit.
      console.log("User input complete, program exit.");
      process.exit();
    } else {
      if (aux) {
        userName = data.replace(/(\r\n|\n|\r)/gm, ""); // remove /n from data
        aux = false;
        printChat(db);
      } else {
        const query = async () => {
          try {
            const entry = { userName: userName, message: data }
            await db.add(entry)
            printChat(db);

          } catch (e) {
            console.error(e)
            process.exit(1)
          }
        }
        query();
      }
    }

  });
}


startMasterNode()




