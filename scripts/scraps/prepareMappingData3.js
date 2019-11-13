const fs = require('fs');
const process = require('process');
const fetch = require('node-fetch');

const outputPath = 'src/data/lowlines/maps/destinations/index.json';

async function work(input) {
  const output = {};

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
          .filter(node => ['title', 'fast-travel'].includes(node.type))
          .map(node => {
            const n = {
              id: node.id,
              type: node.type,
              x: node.x,
              y: node.y
            };

            // if (node.type === 'title') n.name = location.title

            return n;
          })
      }))
    };

    output[d.id] = temp;
  }));

  fs.writeFileSync(outputPath, JSON.stringify(output));
}

fetch('https://lowlidev.com.au/destiny/api/v2/map/data')
  .then(res => res.json())
  .then(json => work(json));
