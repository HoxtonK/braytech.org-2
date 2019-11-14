/* eslint-disable no-unused-vars */
import React from 'react';
import { once, orderBy } from 'lodash';

import manifest from './manifest';
import * as destinyEnums from './destinyEnums';

// TODO: we can just use itemCategoryHashes for this now?
export const isOrnament = item => item.inventory && item.inventory.stackUniqueLabel && item.plug && item.plug.plugCategoryIdentifier && item.plug.plugCategoryIdentifier.includes('skins');

export function hasCategoryHash(item, categoryHash) {
  return item.itemCategoryHashes && item.itemCategoryHashes.includes(categoryHash);
}

export function totalValor() {
  return Object.keys(manifest.DestinyProgressionDefinition[2626549951].steps).reduce((sum, key) => {
    return sum + manifest.DestinyProgressionDefinition[2626549951].steps[key].progressTotal;
  }, 0);
}

export function totalGlory() {
  return Object.keys(manifest.DestinyProgressionDefinition[2000925172].steps).reduce((sum, key) => {
    return sum + manifest.DestinyProgressionDefinition[2000925172].steps[key].progressTotal;
  }, 0);
}

export function totalInfamy() {
  return Object.keys(manifest.DestinyProgressionDefinition[2772425241].steps).reduce((sum, key) => {
    return sum + manifest.DestinyProgressionDefinition[2772425241].steps[key].progressTotal;
  }, 0);
}

export function collectionTotal(data) {
  if (!data.profileCollectibles || !data.characterCollectibles) {
    console.warn('No data provided to destinyUtils.collectionTotal');
    return '0';
  }

  let collectionTotal = 0;
  let profileTempCollections = {};

  for (const [hash, collectible] of Object.entries(data.profileCollectibles.data.collectibles)) {
    let collectibleState = destinyEnums.enumerateCollectibleState(collectible.state);
    if (!collectibleState.notAcquired) {
      if (!profileTempCollections[hash]) {
        profileTempCollections[hash] = 1;
      }
    }
  }

  for (const [characterId, character] of Object.entries(data.characterCollectibles.data)) {
    for (const [hash, collectible] of Object.entries(character.collectibles)) {
      let collectibleState = destinyEnums.enumerateCollectibleState(collectible.state);
      if (!collectibleState.notAcquired) {
        if (!profileTempCollections[hash]) {
          profileTempCollections[hash] = 1;
        }
      }
    }
  }

  for (const [hash, collectible] of Object.entries(profileTempCollections)) {
    collectionTotal++;
  }

  return collectionTotal;
}

export function progressionSeasonRank(member) {
  if (!member) {
    console.warn('No member data provided');
    
    return false;
  }

  let progression = {...member.data.profile.characterProgressions.data[member.characterId].progressions[1628407317]};

  if (progression.level === progression.levelCap) {
    progression = { ...member.data.profile.characterProgressions.data[member.characterId].progressions[3184735011] };
    progression.level += 100;
  }
  
  return progression;
}

/**
 * Convert a gender type to english string
 * @param type Destiny gender type
 * @return english string representation of type
 */
export function genderTypeToString(type) {
  let string;

  switch (type) {
    case 0:
      string = 'Male';
      break;
    case 1:
      string = 'Female';
      break;
    default:
      string = 'uh oh';
  }

  return string;
}

export function groupMemberTypeToString(str) {
  let string;

  switch (str) {
    case 1:
      string = 'Beginner';
      break;
    case 2:
      string = 'Member';
      break;
    case 3:
      string = 'Admin';
      break;
    case 4:
      string = 'Acting Founder';
      break;
    case 5:
      string = 'Founder';
      break;
    default:
      string = 'None';
  }

  return string;
}

export function raceTypeToString(str) {
  let string;

  switch (str) {
    case 0:
      string = 'Human';
      break;
    case 1:
      string = 'Awoken';
      break;
    case 2:
      string = 'Exo';
      break;
    default:
      string = 'uh oh';
  }

  return string;
}

export function classHashToString(hash, gender) {
  let classDef = manifest.DestinyClassDefinition[hash];
  if (!classDef) return 'uh oh';
  if (classDef.genderedClassNames) {
    return classDef.genderedClassNames[gender === 1 ? 'Female' : 'Male'];
  }
  return classDef.displayProperties.name;
}

export function raceHashToString(hash, gender, nonGendered = false) {
  let raceDef = manifest.DestinyRaceDefinition[hash];
  if (!raceDef) return 'uh oh';
  if (raceDef.genderedRaceNames && !nonGendered) {
    return raceDef.genderedRaceNames[gender === 1 ? 'Female' : 'Male'];
  }
  return raceDef.displayProperties.name;
}

export function getDefName(hash, defType = 'DestinyInventoryItemDefinition') {
  try {
    return manifest[defType][hash].displayProperties.name;
  } catch (e) {}
  return 'uh oh';
}

export function classTypeToString(str) {
  let string;

  switch (str) {
    case 0:
      string = 'Titan';
      break;
    case 1:
      string = 'Hunter';
      break;
    case 2:
      string = 'Warlock';
      break;
    default:
      string = 'uh oh';
  }

  return string;
}

export function membershipTypeToString(str, short = false) {
  let string;

  if (short) {
    switch (str) {
      case 1:
        string = 'XB';
        break;
      case 2:
        string = 'PS';
        break;
      case 4:
        string = 'PC';
        break;
      default:
        string = '??';
    }
  } else {
    switch (str) {
      case 1:
        string = 'Xbox';
        break;
      case 2:
        string = 'PlayStation';
        break;
      case 4:
        string = 'PC';
        break;
      default:
        string = 'uh oh';
    }
  }

  return string;
}

export function damageTypeToString(type) {
  let string;

  switch (type) {
    case 3373582085:
      string = 'Kinetic';
      break;
    case 1847026933:
      string = 'Solar';
      break;
    case 2303181850:
      string = 'Arc';
      break;
    case 3454344768:
      string = 'Void';
      break;
    default:
      string = 'idk';
  }

  return string;
}

export function energyTypeToAsset(type) {
  let string;
  let icon;

  switch (type) {
    case 591714140:
      string = 'solar';
      icon = '';
      break;
    case 728351493:
      string = 'arc';
      icon = '';
      break;
    case 4069572561:
      string = 'void';
      icon = '';
      break;
    case 1198124803:
      string = 'any';
      icon = '';
      break;
    default:
      string = '';
      icon = '';
  }

  return {
    string,
    icon
  };
}

export function breakerTypeToIcon(type) {
  let icon;

  switch (type) {
    case 3178805705:
      icon = '';
      break;
    case 485622768:
      icon = '';
      break;
    case 2611060930:
      icon = '';
      break;
    default:
      icon = '';
  }

  return icon;
}

function getSubclassPath(gridDef, talentGrid) {
  let activatedNodes = talentGrid.nodes.filter(node => node.isActivated).map(node => node.nodeIndex);
  let selectedSkills = gridDef.nodeCategories.filter(category => {
    var overlapping = category.nodeHashes.filter(nodeHash => activatedNodes.indexOf(nodeHash) > -1);
    return overlapping.length > 0;
  });
  let subclassPath = selectedSkills.find(nodeDef => nodeDef.isLoreDriven);
  return subclassPath;
}

export function getSubclassPathInfo(profile, characterId) {
  const characters = profile.characters.data;
  const characterEquipment = profile.characterEquipment.data;
  const itemComponents = profile.itemComponents;

  const classTypes = { Titan: 0, Hunter: 1, Warlock: 2 };
  const damageTypes = { Arc: 2, Thermal: 3, Void: 4 };
  const identifiers = { First: 'FirstPath', Second: 'SecondPath', Third: 'ThirdPath' };

  const pathsCustomInfo = [
    {
      classType: classTypes.Titan,
      damageType: damageTypes.Arc,
      identifier: identifiers.First,
      art: '01A3-0000112B'
    },
    {
      classType: classTypes.Titan,
      damageType: damageTypes.Arc,
      identifier: identifiers.Second,
      art: '01A3-0000112B'
    },
    {
      classType: classTypes.Titan,
      damageType: damageTypes.Arc,
      identifier: identifiers.Third,
      art: '01E3-00001598'
    },
    {
      classType: classTypes.Titan,
      damageType: damageTypes.Thermal,
      identifier: identifiers.First,
      art: '01A3-0000116E'
    },
    {
      classType: classTypes.Titan,
      damageType: damageTypes.Thermal,
      identifier: identifiers.Second,
      art: '01A3-0000116E'
    },
    {
      classType: classTypes.Titan,
      damageType: damageTypes.Thermal,
      identifier: identifiers.Third,
      art: '01E3-0000159D'
    },
    {
      classType: classTypes.Titan,
      damageType: damageTypes.Void,
      identifier: identifiers.First,
      art: '01A3-00001179'
    },
    {
      classType: classTypes.Titan,
      damageType: damageTypes.Void,
      identifier: identifiers.Second,
      art: '01A3-00001179'
    },
    {
      classType: classTypes.Titan,
      damageType: damageTypes.Void,
      identifier: identifiers.Third,
      art: '01E3-0000159F'
    },
    {
      classType: classTypes.Hunter,
      damageType: damageTypes.Arc,
      identifier: identifiers.First,
      art: '01A3-000010B4'
    },
    {
      classType: classTypes.Hunter,
      damageType: damageTypes.Arc,
      identifier: identifiers.Second,
      art: '01A3-000010B4'
    },
    {
      classType: classTypes.Hunter,
      damageType: damageTypes.Arc,
      identifier: identifiers.Third,
      art: '01E3-00001593'
    },
    {
      classType: classTypes.Hunter,
      damageType: damageTypes.Thermal,
      identifier: identifiers.First,
      art: '01A3-000010F8'
    },
    {
      classType: classTypes.Hunter,
      damageType: damageTypes.Thermal,
      identifier: identifiers.Second,
      art: '01A3-000010F8'
    },
    {
      classType: classTypes.Hunter,
      damageType: damageTypes.Thermal,
      identifier: identifiers.Third,
      art: '01E3-00001595'
    },
    {
      classType: classTypes.Hunter,
      damageType: damageTypes.Void,
      identifier: identifiers.First,
      art: '01A3-00001107'
    },
    {
      classType: classTypes.Hunter,
      damageType: damageTypes.Void,
      identifier: identifiers.Second,
      art: '01A3-00001107'
    },
    {
      classType: classTypes.Hunter,
      damageType: damageTypes.Void,
      identifier: identifiers.Third,
      art: '01E3-00001596'
    },
    {
      classType: classTypes.Warlock,
      damageType: damageTypes.Arc,
      identifier: identifiers.First,
      art: '01A3-000011A1'
    },
    {
      classType: classTypes.Warlock,
      damageType: damageTypes.Arc,
      identifier: identifiers.Second,
      art: '01A3-000011A1'
    },
    {
      classType: classTypes.Warlock,
      damageType: damageTypes.Arc,
      identifier: identifiers.Third,
      art: '01E3-000015A1'
    },
    {
      classType: classTypes.Warlock,
      damageType: damageTypes.Thermal,
      identifier: identifiers.First,
      art: '01A3-000011F1'
    },
    {
      classType: classTypes.Warlock,
      damageType: damageTypes.Thermal,
      identifier: identifiers.Second,
      art: '01A3-000011F1'
    },
    {
      classType: classTypes.Warlock,
      damageType: damageTypes.Thermal,
      identifier: identifiers.Third,
      art: '01E3-000015A2'
    },
    {
      classType: classTypes.Warlock,
      damageType: damageTypes.Void,
      identifier: identifiers.First,
      art: '01A3-0000120D'
    },
    {
      classType: classTypes.Warlock,
      damageType: damageTypes.Void,
      identifier: identifiers.Second,
      art: '01A3-0000120D'
    },
    {
      classType: classTypes.Warlock,
      damageType: damageTypes.Void,
      identifier: identifiers.Third,
      art: '01E3-000015A5'
    }
  ];

  let equipment = characterEquipment[characterId].items;
  equipment = equipment.map(item => ({
    ...manifest.DestinyInventoryItemDefinition[item.itemHash],
    ...item,
    itemComponents: {
      perks: itemComponents.perks.data[item.itemInstanceId] ? itemComponents.perks.data[item.itemInstanceId].perks : null,
      objectives: itemComponents.objectives.data[item.itemInstanceId] ? itemComponents.objectives.data[item.itemInstanceId].objectives : null
    }
  }));

  let subclass = equipment.find(item => item.inventory.bucketTypeHash === 3284755031);
  let talentGrid = itemComponents.talentGrids.data[subclass.itemInstanceId];
  let gridDef = manifest.DestinyTalentGridDefinition[talentGrid.talentGridHash];
  let talentPath = getSubclassPath(gridDef, talentGrid);
  let damageNames = ['', '', 'arc', 'solar', 'void'];
  let damageType = subclass.talentGrid.hudDamageType;
  if (talentPath == null) {
    talentPath = { displayProperties: { name: 'Unknown' }, identifier: 'FirstPath' };
  }
  let pathCustom = pathsCustomInfo.find(p => p.classType === subclass.classType && p.damageType === damageType && p.identifier === talentPath.identifier);
  let path = {
    name: talentPath.displayProperties.name,
    element: damageNames[subclass.talentGrid.hudDamageType],
    art: pathCustom.art
  };

  return path;
}

export function ammoTypeToString(type) {
  let string;

  switch (type) {
    case 1:
      string = 'Primary';
      break;
    case 2:
      string = 'Special';
      break;
    case 3:
      string = 'Heavy';
      break;
    default:
      string = 'idk';
  }

  return string;
}

// matches first bracketed thing in the string, or certain private unicode characters
const hashExtract = /^([^[\]]*)(\[[^[\]]+?\]|[\uE099-\uE154])(.*)$/u;

function supplementedConversionTable() {
  // conversionTable holds input & output rules for icon replacement. baseConversionTable is used to build it.
  const baseConversionTable = [
    { char: 'lol wot kinetic', objectiveHash: 3924246227, substring: '' },
    { char: '', objectiveHash: 2994623161, substring: '' },
    { char: '', objectiveHash: 2178780271, substring: '' },
    { char: '', objectiveHash: 695106797, substring: '' },
    { char: '', objectiveHash: 3951261483, substring: '' },
    { char: '', objectiveHash: 3711356257, substring: '' },
    { char: '', objectiveHash: 3287913530, substring: '' },
    { char: '', objectiveHash: 1242546978, substring: '' },
    { char: '', objectiveHash: 532914921, substring: '' },
    { char: '', objectiveHash: 2161000034, substring: '' },
    { char: '', objectiveHash: 2062881933, substring: '' },
    { char: '', objectiveHash: 53304862, substring: '' },
    { char: '', objectiveHash: 635284441, substring: '' },
    { char: '', objectiveHash: 3527067345, substring: '' },
    { char: '', objectiveHash: 3296270292, substring: '' },
    { char: '', objectiveHash: 2722409947, substring: '' },
    { char: '', objectiveHash: 2203404732, substring: '' },
    { char: '', objectiveHash: 299893109, substring: '' },
    { char: '', objectiveHash: 2152699013, substring: '' },
    { char: '', objectiveHash: 3080184954, substring: '' },
    { char: '', objectiveHash: 2923868331, substring: '' },
    { char: '', objectiveHash: 989767424, substring: '' },
    { char: '', objectiveHash: 1788114534, substring: '' },
    { char: '', objectiveHash: 276438067, substring: '' },
    { char: '', objectiveHash: 3792840449, substring: '' },
    { char: '', objectiveHash: 2031240843, substring: '' }
  ];

  // loop through conversionTable entries to update them with manifest string info
  baseConversionTable.forEach((iconEntry, index) => {
    const objectiveDef = manifest.DestinyObjectiveDefinition[iconEntry.objectiveHash];
    if (!objectiveDef) {
      return;
    }
    delete baseConversionTable[index].objectiveHash;

    // lookup this lang's string for the objective
    const progressDescription = objectiveDef.progressDescription;

    // match the first bracketed item, or the first zh character, plus beforestuff and afterstuff
    const iconString = progressDescription.match(hashExtract)[2];

    // the identified iconString is the manifest's replacement marker for this icon. put back into table
    baseConversionTable[index].substring = iconString;
  });

  return baseConversionTable;
}

// returns the string-to-svg conversion table
const conversionTable = once(supplementedConversionTable);

// recurses progressDescription, looking for sequences to replace with icons
function replaceWithIcons(conversionRules, remainingObjectiveString, alreadyProcessed = []) {
  // check remainingObjectiveString for replaceable strings
  const matchResults = remainingObjectiveString.match(hashExtract);

  // return immediately if there's nothing to try and replace
  if (!matchResults) {
    return alreadyProcessed.concat([remainingObjectiveString]);
  }

  // set variables to do replacement
  const [, beforeMatch, iconString, afterMatch] = matchResults;

  // look through conversionRules, find corresponding icon, group with processed material
  const replacementIndex = conversionRules.find(iconEntry => iconEntry.substring === iconString);
  const replacement = replacementIndex ? replacementIndex.char : iconString;

  // what was this even for?
  // if (replacement === iconString) console.log(iconString)

  const nowProcessed = alreadyProcessed.concat([beforeMatch, replacement]);

  // send the rest to recurse and check for more brackets
  return replaceWithIcons(conversionRules, afterMatch, nowProcessed);
}

export function stringToIcons(string) {
  // powered by DIM brilliance: @delphiactual, @sundevour, @bhollis
  // https://github.com/DestinyItemManager/DIM/blob/master/src/app/progress/ObjectiveDescription.tsx

  return replaceWithIcons(conversionTable(), string);
}

// thank you DIM (https://github.com/DestinyItemManager/DIM/blob/master/src/app/inventory/store/well-rested.ts)
export function isWellRested(characterProgression) {
  // We have to look at both the regular progress and the "legend" levels you gain after hitting the cap.
  // Thanks to expansions that raise the level cap, you may go back to earning regular XP after getting legend levels.
  const levelProgress = characterProgression.progressions[1716568313];
  const legendProgressDef = manifest.DestinyProgressionDefinition[2030054750];
  const legendProgress = characterProgression.progressions[2030054750];

  // You can only be well-rested if you've hit the normal level cap.
  // And if you haven't ever gained 3 legend levels, no dice.
  if (levelProgress.level < levelProgress.levelCap || legendProgress.level < 4) {
    return {
      wellRested: false
    };
  }

  const progress = legendProgress.weeklyProgress;

  const requiredXP = xpRequiredForLevel(legendProgress.level, legendProgressDef) + xpRequiredForLevel(legendProgress.level - 1, legendProgressDef) + xpRequiredForLevel(legendProgress.level - 2, legendProgressDef);

  // Have you gained XP equal to three full levels worth of XP?
  return {
    wellRested: progress < requiredXP,
    progress,
    requiredXP
  };
}

/**
 * How much XP was required to achieve the given level?
 */
function xpRequiredForLevel(level, progressDef) {
  const stepIndex = Math.min(Math.max(0, level), progressDef.steps.length - 1);
  return progressDef.steps[stepIndex].progressTotal;
}

export function lastPlayerActivity(member) {

  if (!member.profile || (!member.profile.characterActivities.data || !member.profile.characters.data.length)) {
    return [{}];
  }

  return member.profile.characters.data.map(character => {

    const lastActivity = member.profile.characterActivities.data[character.characterId];

    const definitionActivity = manifest.DestinyActivityDefinition[lastActivity.currentActivityHash];
    const definitionActivityMode = definitionActivity ? (definitionActivity.placeHash === 2961497387 ? false : manifest.DestinyActivityModeDefinition[lastActivity.currentActivityModeHash]) : false;
    const definitionPlace = definitionActivity ? definitionActivity.placeHash ? manifest.DestinyPlaceDefinition[definitionActivity.placeHash] : false : false;
    const definitionPlaceOrbit = manifest.DestinyPlaceDefinition[2961497387];
    const definitionActivityPlaylist = manifest.DestinyActivityDefinition[lastActivity.currentPlaylistActivityHash];
    
    let lastActivityString = false;
    if (definitionActivity && !definitionActivity.redacted) {
      if (definitionActivity.activityTypeHash === 400075666) { // Menagerie

        lastActivityString = `${definitionActivity.selectionScreenDisplayProperties && definitionActivity.selectionScreenDisplayProperties.name ? definitionActivity.selectionScreenDisplayProperties.name : definitionActivity.displayProperties && definitionActivity.displayProperties.name}`;

      } else if (lastActivity.currentActivityModeHash === 547513715 && destinyEnums.ordealHashes.includes(lastActivity.currentActivityHash)) { // Nightfall ordeals

        lastActivityString = definitionActivity.displayProperties.name;

      } else if (lastActivity.currentActivityModeHash === 547513715) { // Scored Nightfall Strikes

        lastActivityString = definitionActivity.selectionScreenDisplayProperties && definitionActivity.selectionScreenDisplayProperties.name ? `${definitionActivityMode.displayProperties.name}: ${definitionActivity.selectionScreenDisplayProperties.name}` : `${definitionActivityMode.displayProperties.name}: ${definitionActivity.displayProperties.name}`;

      } else if (lastActivity.currentActivityModeHash === 1963485238) { // Vex Offensive

        lastActivityString = `${manifest.DestinyActivityTypeDefinition[definitionActivity.activityTypeHash].displayProperties.name}: ${definitionActivity.displayProperties.name}`;

      } else if (definitionActivity.activityTypeHash === 838603889) { // Forge Ignition

        lastActivityString = `${definitionActivity.displayProperties.name}: ${definitionActivityPlaylist.displayProperties.name}`;

      } else if (definitionPlace && definitionActivity.placeHash === 4148998934) { // The Reckoning

        lastActivityString = `${definitionActivity.displayProperties.name}`;

      } else if ([1164760504].includes(lastActivity.currentActivityModeHash)) { // Crucible

        lastActivityString = `${definitionActivityMode.displayProperties.name}: ${definitionActivityPlaylist.displayProperties.name}: ${definitionActivity.displayProperties.name}`;

      } else if ([135537449, 740891329].includes(lastActivity.currentPlaylistActivityHash)) { // Survival, Survival: Freelance

        lastActivityString = `${definitionActivityPlaylist.displayProperties.name}: ${definitionActivity.displayProperties.name}`;

      } else if (definitionActivityMode) { // Default

        lastActivityString = `${definitionActivityMode.displayProperties.name}: ${definitionActivity.displayProperties.name}`;

      } else if (definitionActivity.placeHash === 2961497387) { // Orbit

        lastActivityString = definitionPlaceOrbit.displayProperties.name;

      } else {

        lastActivityString = definitionActivity.displayProperties.name;

      }
    } else if (definitionActivity && definitionActivity.redacted) {
      lastActivityString = `Classified`;
    } else {
      lastActivityString = false;
    }

    const lastMode = (definitionActivityMode && definitionActivityMode.parentHashes && definitionActivityMode.parentHashes.map(hash => manifest.DestinyActivityModeDefinition[hash])) || [];

    return {
      characterId: character.characterId,
      lastPlayed: lastActivity ? lastActivity.dateActivityStarted : member.profile.profile.data.dateLastPlayed,
      lastActivity,
      lastActivityString,
      lastMode
    };

  })
}