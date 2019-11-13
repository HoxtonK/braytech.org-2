const fs = require('fs');
const fetch = require('node-fetch');

const outputPath = './dump/index.json';

async function work(input) {
  let output = {};

  await Promise.all(input.data.map(async d => {
    const destination = await fetch('https://lowlidev.com.au/destiny/api/v2/map/data/' + d.id).then(res => res.json());

    const temp = {};

    temp.destination = {
      hash: destination.data.map.destinationHash,
      name: destination.data.map.name,
      description: destination.data.map.description,
      id: destination.data.map.id
    };

    temp.map = {
      width: destination.data.map.width,
      height: destination.data.map.height,
      layers: destination.data.map.layers,
      bubbles: destination.data.map.locations && destination.data.map.locations.map(location => ({
        name: location.title,
        id: location.id,
        type: location.public ? 'region' : location.lostSector ? 'lost-sector' : 'suburb',
        nodes: location.nodes
          // .filter(node => ['title', 'fast-travel'].includes(node.type))
          // .map(node => {
          //   const n = {
          //     id: node.id,
          //     type: node.type,
          //     x: node.x,
          //     y: node.y
          //   };

          //   // if (node.type === 'title') n.name = location.title

          //   return n;
          // })
      }))
    };

    //output = output.concat(destination.data.map.locations);
    output[destination.data.map.destinationHash] = temp;
  }));

  fs.writeFileSync(outputPath, JSON.stringify(output));
}

fetch('https://lowlidev.com.au/destiny/api/v2/map/data')
  .then(res => res.json())
  .then(json => work(json));
