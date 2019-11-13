import manifest from '../manifest';
import * as enums from '../destinyEnums';

/**
 * These are the utilities that deal with figuring out Masterwork info.
 *
 * This is called from within d2-item-factory.service.ts
 */

// const resistanceMods = {
//   1546607977: DamageType.Kinetic,
//   1546607980: DamageType.Void,
//   1546607978: DamageType.Arc,
//   1546607979: DamageType.Thermal
// };

/**
 * This builds the masterwork info - this isn't whether an item is masterwork, but instead what
 * "type" of masterwork it is, what the kill tracker value is, etc. Exotic weapons can start having
 * kill trackers before they're masterworked.
 */
export const masterwork = item => {
  if (!item.sockets) {
    return null;
  }

  let masterworkInfo = null;

  // Pre-Forsaken Masterwork
  if (item.masterwork) {
    masterworkInfo = buildMasterworkInfo(item.sockets);
  }

  // Forsaken Masterwork
  if (!masterworkInfo) {
    masterworkInfo = buildForsakenMasterworkInfo(item);
  }

  return masterworkInfo;
}

/**
 * Post-Forsaken weapons store their masterwork info and kill tracker on different plugs.
 */
function buildForsakenMasterworkInfo(item) {
  const masterworkStats = buildForsakenMasterworkStats(item);
  const killTracker = buildForsakenKillTracker(item);

  // override stats values with killtracker if it's available
  if (masterworkStats && killTracker) {
    return { ...masterworkStats, ...killTracker };
  }
  return masterworkStats || killTracker || null;
}

function buildForsakenKillTracker(item) {
  // const killTrackerSocket = item.sockets.sockets && item.sockets.sockets.find((socket) =>
  //   Boolean(idx(socket.plug, (p) => p.plugObjectives.length))
  // );

  const killTrackerSocket = null;

  if (
    killTrackerSocket &&
    killTrackerSocket.plug &&
    killTrackerSocket.plug.plugObjectives &&
    killTrackerSocket.plug.plugObjectives.length
  ) {
    const plugObjective = killTrackerSocket.plug.plugObjectives[0];

    const objectiveDef = manifest.DestinyObjectiveDefinition[plugObjective.objectiveHash];

    return {
      progress: plugObjective.progress,
      typeIcon: objectiveDef.displayProperties.icon,
      typeDesc: objectiveDef.progressDescription,
      typeName: [3244015567, 2285636663, 38912240].includes(killTrackerSocket.plug.plugItem.hash)
        ? 'Crucible'
        : 'Vanguard'
    };
  }
  return null;
}

const damageTypeNames = {
  0: null,
  1: 'kinetic',
  2: 'arc',
  3: 'solar',
  4: 'void',
  5: 'raid'
};

function buildForsakenMasterworkStats(item) {
  const masterworkSocket = item.sockets.sockets && item.sockets.sockets.find((socket) =>
    Boolean(
      socket.plug &&
        socket.plug.plugItem.plug &&
        (socket.plug.plugItem.plug.plugCategoryIdentifier.includes('masterworks.stat') ||
          socket.plug.plugItem.plug.plugCategoryIdentifier.endsWith('_masterwork'))
    )
  );
  
  if (
    masterworkSocket &&
    masterworkSocket.plug &&
    masterworkSocket.plug.plugItem.investmentStats.length
  ) {
    const masterwork = masterworkSocket.plug.plugItem.investmentStats[0];

    // const dmg = damageTypeNames[
    //   (instanceDef ? instanceDef.damageType : itemDef.defaultDamageType) || DamageType.None
    // ] ||
    // (instanceDef && instanceDef.energy && energyCapacityTypeNames[instanceDef.energy.energyType]) ||
    // null;

    // if (!dmg && item.bucket && item.bucket.sort === 'Armor') {
    //   dmg = [null, 'heroic', 'arc', 'solar', 'void'][
    //     resistanceMods[masterwork.statTypeHash]
    //   ];
    // }

    const statDef = manifest.DestinyStatDefinition[masterwork.statTypeHash];

    return {
      typeName: null,
      typeIcon: masterworkSocket.plug.plugItem.displayProperties.icon,
      typeDesc: masterworkSocket.plug.plugItem.displayProperties.description,
      statHash: masterwork.statTypeHash,
      statName: statDef.displayProperties.name,
      statValue: masterworkSocket.plug.stats
        ? masterworkSocket.plug.stats[masterwork.statTypeHash]
        : (masterworkSocket.plugOptions.find(p => p.plugItem.hash === masterworkSocket.plug.plugItem.hash) && masterworkSocket.plugOptions.find(p => p.plugItem.hash === masterworkSocket.plug.plugItem.hash).stats[masterwork.statTypeHash]) || 0,
      tier: masterwork.value
    };
  }
  return null;
}

/**
 * Pre-Forsaken weapons store their masterwork info on an objective of a plug.
 */
function buildMasterworkInfo(sockets) {
  const socket = sockets.sockets.find((socket) =>
    Boolean(socket.plug && socket.plug.plugObjectives.length)
  );

  if (
    !socket ||
    !socket.plug ||
    !socket.plug.plugObjectives ||
    !socket.plug.plugObjectives.length
  ) {
    return null;
  }

  const plugObjective = socket.plug.plugObjectives[0];
  const investmentStats = socket.plug.plugItem.investmentStats;
  if (!investmentStats || !investmentStats.length) {
    return null;
  }

  const statHash = investmentStats[0].statTypeHash;

  const objectiveDef = manifest.DestinyObjectiveDefinition[plugObjective.objectiveHash];
  const statDef = manifest.DestinyStatDefinition[statHash];

  if (!objectiveDef || !statDef) {
    return null;
  }

  return {
    progress: plugObjective.progress,
    typeName: socket.plug.plugItem.plug.plugCategoryHash === 2109207426 ? 'Vanguard' : 'Crucible',
    typeIcon: objectiveDef.displayProperties.icon,
    typeDesc: objectiveDef.progressDescription,
    statHash,
    statName: statDef.displayProperties.name,
    statValue: socket.plug.stats ? socket.plug.stats[statHash] : 0,
    tier: investmentStats[0].value
  };
}
