// Used to extract node information from lowlines' helpful API endpoint
// at https://lowlidev.com.au/destiny/api/v2/map/supported so that we don't
// need to embed the entire file inside the application.

const fs = require('fs');
const process = require('process');
const fetch = require('node-fetch');

const outputPath = 'src/data/lowlines/checklists/index.json';

// if (process.argv.length !== 3) {
//   console.log('Syntax: extractLowlinesData.js <lowlines.json>');
//   process.exit(1);
// }

const assisted = JSON.parse(fs.readFileSync('src/data/lowlines/dump/index.json')).filter(a => a);

function work(input) {
  const output = {
    checklists: {},
    records: {}
  };
  
  Object.entries(input.data.checklists).forEach(([id, indices]) => {
    if (!indices || indices.length === 0) return;
  
    const item = input.data.nodes[indices[0]];

    let ass = assisted.find(a => a.nodes.find(n => n.checklistHash === parseInt(id, 10))) || {};
    if (ass.nodes) ass = ass.nodes.find(n => n.checklistHash === parseInt(id, 10)) || {}

    // if (id === '89704164') console.log(item.node.x, ass.x)
  
    output.checklists[id] = {
      destinationId: item.destinationId,
      destinationHash: item.destinationHash,
      bubbleId: item.bubbleId,
      bubbleHash: item.bubbleHash,
      recordHash: parseInt(item.node.recordHash, 10),
      node: {
        ...item.node,
        ...ass
      }
    };
  });
  
  Object.entries(input.data.records).forEach(([id, indices]) => {
    if (!indices || indices.length === 0) return;
  
    const item = input.data.nodes[indices[0]];

    let ass = assisted.find(a => a.nodes.find(n => n.checklistHash === parseInt(id, 10))) || {};
    if (ass.nodes) ass = ass.nodes.find(n => n.checklistHash === parseInt(id, 10)) || {}
  
    output.records[id] = {
      destinationId: item.destinationId,
      destinationHash: item.destinationHash,
      bubbleId: item.bubbleId,
      bubbleHash: item.bubbleHash,
      node: {
        ...item.node,
        ...ass
      }
    };
  });
  
  fs.writeFileSync(outputPath, JSON.stringify(output));
  
}

fetch('https://lowlidev.com.au/destiny/api/v2/map/supported')
    .then(res => res.json())
    .then(json => work(json));

