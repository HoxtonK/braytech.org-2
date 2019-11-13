import _ from 'lodash';

import manifest from '../manifest';
import * as enums from '../destinyEnums';

import * as utils from './utils';

/**
 * These are the utilities that deal with Stats on items - specifically, how to calculate them.
 *
 * This is called from within d2-item-factory.service.ts
 *
 * the process looks like this:
 *
 * buildStats(stats){
 *  stats = buildInvestmentStats(stats)                       // fancy gun math based on fixed info
 *  if (sockets) stats = enhanceStatsWithPlugs(stats){}       // enhance gun math with sockets
 *  if (no stats or is armor) stats = buildLiveStats(stats){} // just rely on what api tells us
 *  if (is armor) stats = buildBaseStats(stats){}             // determine what mods contributed
 *  if (is armor) stats.push(total)
 * }
 */

/** Stats that all armor should have. */
export const armorStats = [
  2996146975, // Mobility
  392767087, // Resilience
  1943323491, // Recovery
  1735777505, // Discipline
  144602215, // Intellect
  4244567218 // Strength
];

/**
 * Which stats to display, and in which order.
 */
export const statWhiteList = [
  3614673599, // Blast Radius
  2523465841, // Velocity
  2837207746, // Swing Speed (sword)
  4043523819, // Impact
  1240592695, // Range
  2762071195, // Efficiency (sword)
  209426660, // Defense (sword)
  1591432999, // Accuracy
  943549884, // Handling
  155624089, // Stability
  4188031367, // Reload Speed
  4284893193, // Rounds Per Minute
  2961396640, // Charge Time
  447667954, // Draw Time
  3871231066, // Magazine
  925767036, // Ammo Capacity
  ...armorStats,
  -1000 // Total
];

/**
 * Which hidden stats to display, and in which order.
 */
export const statAdvWhiteList = [
  1345609583, // Aim Assistance
  3555269338, // Zoom
  2715839340, // Recoil Direction  
  1931675084, // Inventory Size
];

/** Stats that should be forced to display without a bar (just a number). */
const statsNoBar = [
  4284893193, // Rounds Per Minute
  3871231066, // Magazine
  2961396640, // Charge Time
  447667954, // Draw Time
  1931675084, // Recovery
  2715839340 // Recoil Direction
];

/** Stats that are measured in milliseconds. */
export const statsMs = [
  447667954, // Draw Time
  2961396640 // Charge Time
];

/** Show these stats in addition to any "natural" stats */
const hiddenStatsWhitelist = [
  1345609583, // Aim Assistance
  3555269338, // Zoom
  2715839340 // Recoil Direction
];

function shouldShowStat(item, statHash, statDisplays) {
  // Bows have a charge time stat that nobody asked for
  if (
    statHash === 2961396640 &&
    item.itemCategoryHashes &&
    item.itemCategoryHashes.includes(3317538576)
  ) {
    return false;
  }

  // Swords shouldn't show any hidden stats
  const includeHiddenStats = !(
    item.itemCategoryHashes && item.itemCategoryHashes.includes(54)
  );

  return (
    // Must be on the whitelist
    statWhiteList.includes(statHash) &&
    // Must be on the list of interpolated stats, or included in the hardcoded hidden stats list
    (statDisplays[statHash] || (includeHiddenStats && hiddenStatsWhitelist.includes(statHash)))
  );
}

function buildStat(itemStat, statGroup, statDisplays) {
  const statHash = itemStat.statTypeHash;
  const definitionStat = manifest.DestinyStatDefinition[statHash];

  let value = itemStat.value || 0;
  let maximumValue = statGroup.maximumValue || 100; // || 100 to avoid recoil direction NaN
  let bar = !statsNoBar.includes(statHash);
  let smallerIsBetter = false;

  const statDisplay = statDisplays[statHash];

  if (statDisplay) {
    const firstInterp = statDisplay.displayInterpolation[0];
    const lastInterp = statDisplay.displayInterpolation[statDisplay.displayInterpolation.length - 1];
    smallerIsBetter = firstInterp.weight > lastInterp.weight;
    maximumValue = Math.max(statDisplay.maximumValue, firstInterp.weight, lastInterp.weight);
    bar = !statDisplay.displayAsNumeric;
    value = interpolateStatValue(value, statDisplay);
  }

  value = Math.max(0, value);

  return {
    investmentValue: itemStat.value || 0,
    statHash,
    displayProperties: definitionStat.displayProperties,
    sort: statWhiteList.indexOf(statHash),
    value,
    base: value,
    maximumValue,
    bar,
    smallerIsBetter,
    // Only set additive for defense stats, because for some reason Zoom is
    // set to use DestinyStatAggregationType.Character
    additive:
      definitionStat.statCategory === enums.DestinyStatCategory.Defense &&
      definitionStat.aggregationType === enums.DestinyStatAggregationType.Character
  };
}

/**
 * Build stats from the non-pre-sized investment stats. Destiny stats come in two flavors - precalculated
 * by the API, and "investment stats" which are the raw game values. The latter must be transformed into
 * what you see in the game, but as a result you can see "hidden" stats at their true value, and calculate
 * the value that perks and mods contribute to the overall stat value.
 */
function buildInvestmentStats(item, statGroupHash, statDisplays) {
  const definitionItem = manifest.DestinyInventoryItemDefinition[item.itemHash];

  const itemStats = definitionItem.investmentStats || [];

  return _.compact(
    Object.values(itemStats).map((itemStat) => {

      const statHash = itemStat.statTypeHash;

      if (!itemStat || !shouldShowStat(item, statHash, statDisplays)) {
        return undefined;
      }

      const definitionStat = manifest.DestinyStatDefinition[statHash];

      if (!definitionStat) {
        return undefined;
      }

      return buildStat(itemStat, statGroupHash, statDisplays);
    })
  );
}

/**
 * For each stat this plug modified, calculate how much it modifies that stat.
 *
 * Returns a map from stat hash to stat value.
 */
function buildPlugStats(plug, statsByHash, statDisplays) {
  const stats = {};

  for (const perkStat of plug.plugItem.investmentStats) {
    let value = perkStat.value || 0;
    const itemStat = statsByHash[perkStat.statTypeHash];
    const statDisplay = statDisplays[perkStat.statTypeHash];
    if (itemStat && statDisplay) {
      // This is a scaled stat, so we need to scale it in context of the original investment stat.
      // Figure out what the interpolated stat value would be without this perk's contribution, and
      // then take the difference between the total value and that to find the contribution.
      const valueWithoutPerk = interpolateStatValue(itemStat.investmentValue - value, statDisplay);
      value = itemStat.value - valueWithoutPerk;
    } else if (itemStat) {
      const valueWithoutPerk = Math.min(itemStat.investmentValue - value, itemStat.maximumValue);
      value = itemStat.value - valueWithoutPerk;
    }
    stats[perkStat.statTypeHash] = value;
  }
  
  return stats;
}

function enhanceStatsWithPlugs(item, stats, statDisplays) {
  const definitionItem = manifest.DestinyInventoryItemDefinition[item.itemHash];
  const definitionStatGroup = manifest.DestinyStatGroupDefinition[definitionItem.stats.statGroupHash];

  const sockets = item.sockets.sockets;
  const statsByHash = _.keyBy(stats, (s) => s.statHash);

  const modifiedStats = new Set();

  // Add the chosen plugs' investment stats to the item's base investment stats
  for (const socket of sockets) {
    if (socket.plug && socket.plug.plugItem.investmentStats) {
      for (const perkStat of socket.plug.plugItem.investmentStats) {
        const statHash = perkStat.statTypeHash;
        const itemStat = statsByHash[statHash];
        const value = perkStat.value || 0;

        if (itemStat) {
          itemStat.investmentValue += value;

        } else if (shouldShowStat(item, statHash, statDisplays)) {

          // This stat didn't exist before we modified it, so add it here.
          const stat = socket.plug.plugItem.investmentStats.find(
            (s) => s.statTypeHash === statHash
          );

          if (stat && stat.value) {
            const definitionStat = manifest.DestinyStatDefinition[statHash];
            const builtStat = buildStat(stat, definitionStatGroup, definitionStat, statDisplays);
            statsByHash[statHash] = builtStat;
            stats.push(statsByHash[statHash]);
          }
        }

        modifiedStats.add(statHash);
      }
    }
  }

  // Now calculate the actual, interpolated value of all stats after they've been modified
  for (const stat of stats) {
    if (modifiedStats.has(stat.statHash)) {
      const statDisplay = statDisplays[stat.statHash];

      stat.value = statDisplay
        ? interpolateStatValue(stat.investmentValue, statDisplays[stat.statHash])
        : Math.min(stat.investmentValue, stat.maximumValue);

      if (stat.statHash === 2715839340) console.log(stat)
    }
  }

  // We sort the sockets by length so that we count contributions from plugs with fewer options first.
  // This is because multiple plugs can contribute to the same stat, so we want to sink the non-changeable
  // stats in first.
  const sortedSockets = _.sortBy(sockets, (s) => s.plugOptions.length);

  for (const socket of sortedSockets) {
    for (const plug of socket.plugOptions) {
      if (plug && plug.plugItem && plug.plugItem.investmentStats && plug.plugItem.investmentStats.length) {
        plug.stats = buildPlugStats(plug, statsByHash, statDisplays);
      }
    }
  }

  return stats;
}

/**
 * Build the stats that come "live" from the API's data on real instances. This is required
 * for Armor 2.0 since it has random stat rolls.
 */
function buildLiveStats(item, stats, statGroup, statDisplays) {
  return _.compact(
    Object.values(stats.stats).map((itemStat) => {
      const statHash = itemStat.statHash;
      if (!itemStat || !shouldShowStat(item, statHash, statDisplays)) {
        return undefined;
      }

      const statDef = manifest.DestinyStatDefinition[statHash];
      if (!statDef) {
        return undefined;
      }

      let maximumValue = statGroup.maximumValue;
      let bar = !statsNoBar.includes(statHash);
      let smallerIsBetter = false;
      const statDisplay = statDisplays[statHash];
      if (statDisplay) {
        const firstInterp = statDisplay.displayInterpolation[0];
        const lastInterp =
          statDisplay.displayInterpolation[statDisplay.displayInterpolation.length - 1];
        smallerIsBetter = firstInterp.weight > lastInterp.weight;
        maximumValue = Math.max(statDisplay.maximumValue, firstInterp.weight, lastInterp.weight);
        bar = !statDisplay.displayAsNumeric;
      }

      return {
        investmentValue: itemStat.value || 0,
        statHash,
        displayProperties: statDef.displayProperties,
        sort: statWhiteList.indexOf(statHash),
        value: itemStat.value,
        base: itemStat.value,
        maximumValue,
        bar,
        smallerIsBetter,
        additive: statDef.aggregationType === enums.DestinyStatAggregationType.Character
      };
    })
  );
}

/** Build the full list of stats for an item. If the item has no stats, this returns null. */
export const stats = item => {
  const definitionItem = manifest.DestinyInventoryItemDefinition[item.itemHash];
  const definitionStatGroup = definitionItem && definitionItem.stats && manifest.DestinyStatGroupDefinition[definitionItem.stats.statGroupHash];

  if (!item || !definitionStatGroup) {
    return false;
  }

  const statDisplays = _.keyBy(definitionStatGroup.scaledStats, (s) => s.statHash);

  // We only use the raw "investment" stats to calculate all item stats.
  let investmentStats = buildInvestmentStats(item, definitionItem.stats.statGroupHash, statDisplays) || [];

  // Include the contributions from perks and mods
  if (item.sockets && item.sockets.sockets && item.sockets.sockets.length) {
    investmentStats = enhanceStatsWithPlugs(
      item,
      investmentStats,
      statDisplays
    );
  }

  // For Armor, we always replace the previous stats with live stats, even if they were already created
  // if ((!investmentStats.length || item.bucket.inArmor) && stats && stats[item.id]) {
  //   // TODO: build a version of enhanceStatsWithPlugs that only calculates plug values
  //   investmentStats = buildLiveStats(stats[item.id], itemDef, defs, statGroup, statDisplays);
  //   if (item.bucket.inArmor) {
  //     if (item.sockets && item.sockets.sockets.length) {
  //       investmentStats = buildBaseStats(investmentStats, item.sockets.sockets);
  //     }

  //     // Add the "Total" stat for armor
  //     investmentStats.push(totalStat(investmentStats));
  //   }
  // }

  if (definitionItem && definitionItem.itemType === 2) {
    // Add the "Total" stat for armor
    investmentStats.push(totalStat(investmentStats));
  }

  return investmentStats.length ? investmentStats.sort(utils.compareBy((s) => s.sort)) : null;
}


















function totalStat(stats = []) {
  const total = _.sumBy(stats, (s) => s.value);
  const baseTotal = _.sumBy(stats, (s) => s.base);

  return {
    investmentValue: total,
    displayProperties: {
      name: 'Total'
    },
    statHash: -1000,
    sort: statWhiteList.indexOf(-1000),
    value: total,
    base: baseTotal,
    maximumValue: 100,
    bar: false,
    smallerIsBetter: false,
    additive: false
  };
}

/**
 * Some stats have an item-specific interpolation table, which is defined as
 * a piecewise linear function mapping input stat values to output stat values.
 */
function interpolateStatValue(value, statDisplay) {
  const interp = statDisplay.displayInterpolation;

  // Clamp the value to prevent overfilling
  value = Math.max(0, Math.min(value, statDisplay.maximumValue));

  let endIndex = interp.findIndex((p) => p.value > value);
  if (endIndex < 0) {
    endIndex = interp.length - 1;
  }
  const startIndex = Math.max(0, endIndex - 1);

  const start = interp[startIndex];
  const end = interp[endIndex];
  const range = end.value - start.value;
  if (range === 0) {
    return start.weight;
  }

  const t = (value - start.value) / (end.value - start.value);

  const interpValue = start.weight + t * (end.weight - start.weight);

  // vthorn has a hunch that magazine size doesn't use banker's rounding, but the rest definitely do:
  // https://github.com/Bungie-net/api/issues/1029#issuecomment-531849137
  return statDisplay.statHash === 3871231066 ? Math.round(interpValue) : bankersRound(interpValue);
}

/**
 * "Banker's rounding" rounds numbers that perfectly fall halfway between two integers to the nearest
 * even integer, instead of always rounding up.
 */
function bankersRound(x) {
  const r = Math.round(x);
  return (x > 0 ? x : -x) % 1 === 0.5 ? (0 === r % 2 ? r : r - 1) : r;
}
