import Manifest from './manifest';
import _ from 'lodash';

async function run() {
  const manifest = await Manifest.getManifest();

  const nightfalls = {
    3145298904: {
      // The Arms Dealer
      triumphs: [
        3340846443, // The Arms Dealer
        4267516859 // Trash the Thresher
      ],
      items: [],
      collectibles: [
        3036030066, // Tilt Fuse
        3490589921 // The Arms Dealer (Emblem)
      ]
    },
    3108813009: {
      // Warden of Nothing
      triumphs: [
        2836924866, // Warden of Nothing
        1469598452 // Solar Dance
      ],
      items: [],
      collectibles: [
        1279318101, // Warden's Law
        2263264048 // Warden of Nothing (Emblem)
      ]
    },
    3034843176: {
      // The Corrupted
      triumphs: [
        3951275509, // The Corrupted
        3641166665 // Relic Rumble
      ],
      items: [],
      collectibles: [
        1099984904, // Horror's Least
        1410290331 // The Corrupted (Emblem)
      ]
    },
    3280234344: {
      // Savathûn's Song
      triumphs: [
        2099501667, // Savathûn's Song
        1442950315 // The Best Defense
      ],
      items: [],
      collectibles: [
        1333654061, // Duty Bounds
        3490589926 // Savathûn's Song (Emblem)
      ]
    },
    3289589202: {
      // The Pyramidion
      triumphs: [
        1060780635, // The Pyramidion
        1142177491 // Siege Engine
      ],
      items: [],
      collectibles: [
        1152758802, // Silicon Neuroma
        3490589930 // The Pyramidion (Emblem)
      ]
    },
    3718330161: {
      // Tree of Probabilities
      triumphs: [
        2282894388, // Tree of Probabilities
        3636866482 // Laser Dodger
      ],
      items: [],
      collectibles: [
        1279318110, // D.F.A.
        3490589924 // Tree of Probabilities (Emblem)
      ]
    },
    3372160277: {
      // Lake of Shadows
      triumphs: [
        1329556468, // Lake of Shadows
        413743786 // Tether Time
      ],
      items: [],
      collectibles: [
        1602518767, // The Militia's Birthright
        3896331530 // Lake of Shadows (Emblem)
      ]
    },
    1391780798: {
      // Broodhold
      triumphs: [
        3042714868, // Broodhold
        4156350130 // Broodhold challenge
      ],
      items: [],
      collectibles: [
        
      ]
    },
    3701132453: {
      // The Hollowed Lair
      triumphs: [
        3450793480, // The Hollowed Lair
        3847579126 // Arc Avoidance
      ],
      items: [],
      collectibles: [
        1074861258, // Mindbender's Ambition
        3314387486 // The Hollowed Lair (Emblem)
      ]
    },
    272852450: {
      // Will of the Thousands
      triumphs: [
        1039797865, // Will of the Thousands
        3013611925 // Three and Out
      ],
      items: [],
      collectibles: [
        2466440635, // Worm God Incarnation
        1766893928 // Will of the Thousands (Emblem)
      ]
    },
    4259769141: {
      // The Inverted Spire
      triumphs: [
        3973165904, // The Inverted Spire
        1498229894 //The Floor Is Lava
      ],
      items: [],
      collectibles: [
        1718922261, // Trichromatica
        3490589925 //The Inverted SPire (Emblem)
      ]
    },
    522318687: {
      // Strange Terrain
      triumphs: [
        165166474, // Strange Terrain
        1871570556 // Don't Take Five
      ],
      items: [],
      collectibles: [
        1534387877, // BrayTech Osprey
        1766893929 // Strange Terrain (Emblem)
      ]
    },
    1282886582: {
      // Exodus Crash
      triumphs: [
        1526865549, // Exodus Crash
        2140068897 // Faster than Lightning
      ],
      items: [],
      collectibles: [
        3036030067, // Impact Velocity
        3490589927 // Exodus Crash (Emblem)
      ]
    },
    936308438: {
      // A Garden World
      triumphs: [
        2692332187, // A Garden World
        1398454187 // The Quickening
      ],
      items: [],
      collectibles: [
        2448009818, //Universal Wavefunction
        3490589931 // A Garden World (Emblem)
      ]
    },
    1034003646: {
      // The Insight Terminus
      triumphs: [
        599303591, // Capture Completionist
        3399168111 // The Insight Terminus
      ],
      items: [],
      collectibles: [
        1186314105, // The Long Goodbye
        465974149 // Insight Terminus (Emblem)
      ]
    },
    629542775: {
      // The Festering Core
      triumphs: [
      ],
      items: [],
      collectibles: []
    },
    3856436847: {
      // The Scarlet Keep
      triumphs: [],
      items: [],
      collectibles: []
    }
  };

  const ordeals = Object.values(manifest.DestinyActivityDefinition)
    .filter(d => d.displayProperties && d.displayProperties.name && d.displayProperties.name.includes('Nightfall: The Ordeal'));
  
  ordeals
    .forEach((d, i) => {
      console.log(i + ' ' + d.displayProperties.description);
    });
  
  console.log(' ');
  console.log(' ');

  const obj = {};

  Object.keys(nightfalls)
    .forEach((n, i) => {
      console.log(i + ' ' + manifest.DestinyActivityDefinition[n].displayProperties.name);
      
      let hash = Object.values(manifest.DestinyActivityDefinition).filter(d => d.activityModeTypes && d.activityModeTypes.includes(46) && !d.guidedGame && d.modifiers && d.modifiers.length > 2 && d.displayProperties && d.displayProperties.name && d.displayProperties.name.includes(manifest.DestinyActivityDefinition[n].displayProperties.name.replace('Nightfall: ', ''))).map(d => d.hash).join('');
      
      console.log(hash);

      obj[hash] = nightfalls[n];
      obj[hash].ordealHashes = ordeals.filter(o => o.displayProperties.description === manifest.DestinyActivityDefinition[hash].displayProperties.name.replace('Nightfall: ', '')).map(h => h.hash);

      console.log(' ');
    });
  
  console.log(' ');
  console.log(' ');

  console.log(JSON.stringify(obj));

  console.log(' ');

}

run();
