import fs from 'fs';
import Manifest from '../manifest';
import _ from 'lodash';

import newLight from './newLight.json';

const path = 'src/data/lowlines/checklists/index.json';
const data = JSON.parse(fs.readFileSync(path));

const assisted = JSON.parse(fs.readFileSync('scripts/dump/index.json'));
const nodes = [];

Object.keys(assisted).forEach(key => {
  if (!assisted[key].map.bubbles) return;

  assisted[key].map.bubbles.forEach(bubble => {
    bubble.nodes.forEach(node => {
      nodes.push(node);
    });
  })
});

// console.log(nodes)

// For when the mappings generated from lowlines' data don't have a
// bubbleHash but do have a bubbleId. Inferred by cross-referencing
// with https://docs.google.com/spreadsheets/d/1qgZtT1qbUFjyV8-ni73m6UCHTcuLmuLBx-zn_B7NFkY/edit#gid=1808601275
const manualBubbleNames = {
  default: 'The Farm',
  'high-plains': 'High Plains',
  erebus: 'The Shattered Throne',
  descent: 'The Shattered Throne',
  eleusinia: 'The Shattered Throne',
  'cimmerian-garrison': 'Cimmerian Garrison',
  'shattered-ruins': 'Shattered Ruins',
  'agonarch-abyss': 'Agonarch Abyss',
  'keep-of-honed-edges': 'Keep of Honed Edges',
  ouroborea: 'Ouroborea',
  'forfeit-shrine': 'Forfeit Shrine',
  adytum: 'The Corrupted',
  'queens-court': 'The Queens Court',
  'ascendant-plane': 'Dark Monastery'
};

// Anything here gets merged in to created items - use it when you need to
// override something in item()
const itemOverrides = {
  // Brephos II is listed as Temple of Illyn, but it's only available
  // during the strike, so hardcode it here to be consistent with the other
  // strike item.
  1370818869: {
    bubbleHash: false,
    bubbleName: 'The Corrupted'
  }
};

const itemDeletions = [
  1116662180, // Ghost Scan 74 / The Reservoir, Earth / UNAVAILABLE
  3856710545, // Ghost Scan 75 / The Reservoir, Earth / UNAVAILABLE
  508025838,  // Ghost Scan 76 / The Reservoir, Earth / UNAVAILABLE
];

const checklists = [
  4178338182, // adventures
  1697465175, // regionChests
  3142056444, // lostSectors
  1297424116, // ahamkaraBones
  2609997025, // corruptedEggs
  2726513366, // catStatues
  365218222,  // sleeperNodes
  2360931290, // ghostScans
  2955980198, // latentMemories
  1912364094, // jadeRabbits
];

const presentationNodes = [
  1420597821, // ghostStories
  3305936921, // awokenOfTheReef
  655926402,  // forsakenPrince
  2474271317, // inquisitionOfTheDamned
  4285512244, // lunasLost
];

const strikeBubbles = [
  3395411000  // EX-077 Command (Exodus Crash)
];

async function run() {
  const manifest = await Manifest.getManifest();

  function checklistItem(id, item) {
    const existing = (data[id] && data[id].find(c => c.checklistHash === item.hash)) || {};
    const mapping = newLight.checklists[item.hash] || {};

    const destinationHash = item.destinationHash || mapping.destinationHash;
    const bubbleHash = item.bubbleHash || mapping.bubbleHash;

    // Try to find the destination, place and bubble by the hashes if we have them
    const destination = destinationHash && manifest.DestinyDestinationDefinition[destinationHash];
    const place = destination && manifest.DestinyPlaceDefinition[destination.placeHash];
    const bubble = bubbleHash && _.find(destination.bubbles, { hash: bubbleHash });

    // If the item has a name with a number in it, extract it so we can use it later
    // for sorting & display
    const numberMatch = item.displayProperties.name.match(/([0-9]+)/);
    const itemNumber = numberMatch && numberMatch[0];

    // If we don't have a bubble, see if we can infer one from the bubble ID
    const bubbleName = (bubble && bubble.displayProperties.name) || (mapping && mapping.bubbleId && manualBubbleNames[mapping.bubbleId]);
    const backupBubbleName = !(bubble && bubble.displayProperties.name) && (mapping && mapping.bubbleId && manualBubbleNames[mapping.bubbleId]);

    let name = bubbleName;
    if (manifest.DestinyChecklistDefinition[365218222].entries.find(h => h.hash === item.hash)) {
      name = manifest.DestinyInventoryItemDefinition[item.itemHash].displayProperties.description.replace('CB.NAV/RUN.()', '');
    } else if (item.activityHash) {
      name = manifest.DestinyActivityDefinition[item.activityHash].displayProperties.name;
    } else if (mapping && mapping.recordHash) {
      const definitionRecord = manifest.DestinyRecordDefinition[mapping.recordHash];
      const definitionLore = manifest.DestinyLoreDefinition[definitionRecord.loreHash];

      if (definitionLore) name = definitionLore.displayProperties.name;
    }

    // check to see if location is inside lost sector. look up item's bubble hash inside self's lost sector's checklist... unless this is a lost sector item
    const withinLostSector = bubble && bubble.hash && data[3142056444].find(l => l.bubbleHash === bubble.hash) && id !== 3142056444;
    const withinStrike = bubble && bubble.hash && strikeBubbles.find(hash => hash === bubble.hash);

    let located = undefined;
    if (withinLostSector) {
      located = 'lost-sector';
    } else if (withinStrike) {
      located = 'strike';
    }
    
    const changes = {
      destinationHash,
      bubbleHash,
      bubbleName: backupBubbleName,
      activityHash: item.activityHash,
      checklistHash: item.hash,
      itemHash: item && item.itemHash,
      recordHash: mapping.recordHash,
      points: (mapping && mapping.points) || [],
      sorts: {
        destination: destination && destination.displayProperties.name,
        bubble: bubbleName,
        place: place && place.displayProperties.name,
        name,
        number: itemNumber && parseInt(itemNumber, 10)
      },
      extended: {
        located
      }
    }

    const updates = _.mergeWith(existing, changes, merger);

    return updates;
  }

  function merger(e, c) {
    if (Array.isArray(c)) {
      if (!Array.isArray(e)) {
        return c;
      } else if (e.length < 1 && c.length >= 1) {
        return c;
      } else if (c.length === 1 && e.length >= 1) {
        return c;
      } else if (c.length > 1 && e.length > 1) {
        // not emotionally ready to deal with this sorry
        return e;
      } else {
        return e;
      }
    } else if (typeof c === 'object') {
      return _.mergeWith(e, c, merger);
    } else if (c && c !== '') {
      return c;
    } else {
      return e;
    }
  }

  function presentationItems(presentationHash, dropFirst = true) {
    const root = manifest.DestinyPresentationNodeDefinition[presentationHash];
    let recordHashes = root.children.records.map(r => r.recordHash);
    if (dropFirst) recordHashes = recordHashes.slice(1);

    return recordHashes
      .map((hash, itemNumber) => {
        const existing = (data[presentationHash] && data[presentationHash].find(c => c.recordHash === hash)) || {};

        const item = manifest.DestinyRecordDefinition[hash];

        const mapping = newLight.records[hash];
            
        const destinationHash = mapping && mapping.destinationHash;
        const destination = destinationHash && manifest.DestinyDestinationDefinition[destinationHash];
        const place = destination && manifest.DestinyPlaceDefinition[destination.placeHash];
        const bubble = destination && _.find(destination.bubbles, { hash: mapping.bubbleHash });

        // If we don't have a bubble, see if we can infer one from the bubble ID
        const bubbleName = (bubble && bubble.displayProperties.name) || (mapping && mapping.bubbleId && manualBubbleNames[mapping.bubbleId]);
        const backupBubbleName = !(bubble && bubble.displayProperties.name) && (mapping && mapping.bubbleId && manualBubbleNames[mapping.bubbleId]);

        let name = bubbleName;
        if (item.activityHash) {
          name = manifest.DestinyActivityDefinition[item.activityHash].displayProperties.name;
        } else if (mapping && mapping.recordHash) {
          const definitionRecord = manifest.DestinyRecordDefinition[mapping.recordHash];
          const definitionLore = manifest.DestinyLoreDefinition[definitionRecord.loreHash];
    
          if (definitionLore) name = definitionLore.displayProperties.name;
        }
        
        // check to see if location is inside lost sector. look up item's bubble hash inside self's lost sector's checklist... unless this is a lost sector item
        const withinLostSector = bubble && bubble.hash && data[3142056444].find(l => l.bubbleHash === bubble.hash) && hash !== 3142056444;
        const withinStrike = bubble && bubble.hash && strikeBubbles.find(hash => hash === bubble.hash);

        let located = undefined;
        if (withinLostSector) {
          located = 'lost-sector';
        } else if (withinStrike) {
          located = 'strike';
        } else if (mapping && mapping.activityHash) {
          located = 'activity';
        }

        const changes = {
          destinationHash,
          bubbleHash: mapping && mapping.bubbleHash,
          bubbleName: backupBubbleName,
          recordName: item.displayProperties.name,
          recordHash: hash,
          pursuitHash: mapping && mapping.pursuitHash,
          activityHash: mapping && mapping.activityHash,
          points: (mapping && mapping.points) || [],
          sorts: {
            destination: destination && destination.displayProperties.name,
            bubble: bubbleName,
            place: place && place.displayProperties.name,
            name,
            number: (itemNumber + 1)
          },
          extended: {
            located
          }
        }

        if (changes.recordHash === 3390078236) console.log(mapping, existing)
        // console.log(changes)
        // console.log({
        //   ...existing,
        //   ...changes,
        //   ...itemOverrides[item.hash]
        // }
        // )

        // Object.keys(changes).forEach(key => {
        //   if (!changes[key]) delete changes[key];
        // });

        const updates = _.mergeWith(existing, changes, merger);

        //if (changes.recordHash === 3390078237) console.log(updates)

        return updates;
      })
      .filter(i => i);
  }
  
  const lists = {};

  checklists.concat(presentationNodes).forEach(hash => {
    if (presentationNodes.includes(hash)) {
      lists[hash] = presentationItems(hash);
    } else {
      const checklist = manifest.DestinyChecklistDefinition[hash];

      lists[hash] = checklist.entries.filter(entry => itemDeletions.indexOf(entry.hash) < 0).map(entry => {
        return checklistItem(hash, entry);
      });
    }
  });

  fs.writeFileSync(path, JSON.stringify(lists, null, '  '));
}

run();