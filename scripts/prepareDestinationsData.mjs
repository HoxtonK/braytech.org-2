import fs from 'fs';
import fetch from 'node-fetch';
import Manifest from './manifest';
import _ from 'lodash';

const dump = JSON.parse(fs.readFileSync('scripts/dump/index.json'));
const path = 'src/data/lowlines/maps/destinations/index.json';
const input = JSON.parse(fs.readFileSync(path));

let output = input;

async function run() {
  const manifest = await Manifest.getManifest();

  Object.entries(input).forEach(([key, value]) => {

    if (!value.destination.hash) {
      // I really need a hash lol
      return;
    }


    /* add bubble hashes from manifest */

    // if (!value.destination.hash) {
    //   output[key] = value;
    //   return;
    // }

    // const definitionDestination = manifest.DestinyDestinationDefinition[value.destination.hash];

    // value.map.bubbles = value.map.bubbles.map(bubble => {
    //   let bubbleHash = definitionDestination.bubbles.find(b => b.displayProperties.name === bubble.name);

    //   if (!bubbleHash) console.log(bubble)

    //   return {
    //     hash: bubbleHash && bubbleHash.hash,
    //     ...bubble,
    //   }
    // });

    // output[key] = value;


    /* add more nodes with `type` */
    
    // const dumpDestination = dump[value.destination.hash];
    
    // value.map.bubbles.forEach(bubble => {
    //   const dumpBubble = dumpDestination.map.bubbles.find(dumpBubble => dumpBubble.id === bubble.id);
    //   if (!dumpBubble) console.warn(`couldn't match bubble`);

    //   dumpBubble.nodes.forEach(dumpNode => {
    //     if (dumpNode.type === 'vendor') {
    //       if (bubble.nodes.find(node => node.vendorHash === dumpNode.vendorHash)) return; // just one thanks

    //       bubble.nodes.push({
    //         type: dumpNode.type,
    //         vendorHash: dumpNode.vendorHash,
    //         x: dumpNode.x,
    //         y: dumpNode.y
    //       });
    //     }
    //   });
    // });


    /* convert a value from string to int */
      
    // value.map.bubbles.forEach(bubble => {
    //   bubble.nodes.forEach(node => {
    //     if (node.vendorHash) {
    //       node.vendorHash = parseInt(node.vendorHash, 10);
    //     }
    //   });
    // });


    /* remove a dud node */

    value.map.bubbles.forEach(bubble => {
      bubble.nodes = bubble.nodes
        .filter(n => {
          if (n.type === 'vendor' && n.vendorHash !== '') {
            return n
          } else if (n.type !== 'vendor') {
            return n
          } else {
            return false;
          }
        })
        .filter(n => n);
    });


  });

  fs.writeFileSync(path, JSON.stringify(output, null, '  '));

}

run();

