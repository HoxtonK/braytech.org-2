import { merge } from 'lodash';

import braytech_EN from '../data/manifest/en/braytech/';
import DestinyClanBannerDefinition from '../data/manifest/en/DestinyClanBannerDefinition/';
import DestinyActivityDefinition from '../data/manifest/en/DestinyActivityDefinition/';

import DestinyInventoryItemDefinition_EN from '../data/manifest/en/DestinyInventoryItemDefinition/';
import DestinyHistoricalStatsDefinition_EN from '../data/manifest/en/DestinyHistoricalStatsDefinition/';
import DestinyPresentationNodeDefinition_EN from '../data/manifest/en/DestinyPresentationNodeDefinition/';

import DestinyHistoricalStatsDefinition_DE from '../data/manifest/de/DestinyHistoricalStatsDefinition/';
import DestinyHistoricalStatsDefinition_ES from '../data/manifest/es/DestinyHistoricalStatsDefinition/';
import DestinyHistoricalStatsDefinition_ESMX from '../data/manifest/es-mx/DestinyHistoricalStatsDefinition/';
import DestinyHistoricalStatsDefinition_FR from '../data/manifest/fr/DestinyHistoricalStatsDefinition/';
import DestinyHistoricalStatsDefinition_IT from '../data/manifest/it/DestinyHistoricalStatsDefinition/';
import DestinyHistoricalStatsDefinition_JA from '../data/manifest/ja/DestinyHistoricalStatsDefinition/';
import DestinyHistoricalStatsDefinition_KO from '../data/manifest/ko/DestinyHistoricalStatsDefinition/';
import DestinyHistoricalStatsDefinition_PL from '../data/manifest/pl/DestinyHistoricalStatsDefinition/';
import DestinyHistoricalStatsDefinition_PTBR from '../data/manifest/pt-br/DestinyHistoricalStatsDefinition/';
import DestinyHistoricalStatsDefinition_RU from '../data/manifest/ru/DestinyHistoricalStatsDefinition/';
import DestinyHistoricalStatsDefinition_ZHCHT from '../data/manifest/zh-cht/DestinyHistoricalStatsDefinition/';

const customs = {
  de: {
    braytech: braytech_EN,
    DestinyInventoryItemDefinition: DestinyInventoryItemDefinition_EN,
    DestinyHistoricalStatsDefinition: DestinyHistoricalStatsDefinition_DE
  },
  en: {
    braytech: braytech_EN,
    DestinyClanBannerDefinition,
    DestinyActivityDefinition,
    DestinyInventoryItemDefinition: DestinyInventoryItemDefinition_EN,
    DestinyHistoricalStatsDefinition: DestinyHistoricalStatsDefinition_EN,
    DestinyPresentationNodeDefinition: DestinyPresentationNodeDefinition_EN
  },
  'en-au': {
    braytech: braytech_EN,
    DestinyClanBannerDefinition,
    DestinyInventoryItemDefinition: DestinyInventoryItemDefinition_EN,
    DestinyHistoricalStatsDefinition: DestinyHistoricalStatsDefinition_EN
  },
  es: {
    braytech: braytech_EN,
    DestinyInventoryItemDefinition: DestinyInventoryItemDefinition_EN,
    DestinyHistoricalStatsDefinition: DestinyHistoricalStatsDefinition_ES
  },
  'es-mx': {
    braytech: braytech_EN,
    DestinyInventoryItemDefinition: DestinyInventoryItemDefinition_EN,
    DestinyHistoricalStatsDefinition: DestinyHistoricalStatsDefinition_ESMX
  },
  fr: {
    braytech: braytech_EN,
    DestinyInventoryItemDefinition: DestinyInventoryItemDefinition_EN,
    DestinyHistoricalStatsDefinition: DestinyHistoricalStatsDefinition_FR
  },
  it: {
    braytech: braytech_EN,
    DestinyInventoryItemDefinition: DestinyInventoryItemDefinition_EN,
    DestinyHistoricalStatsDefinition: DestinyHistoricalStatsDefinition_IT
  },
  ja: {
    braytech: braytech_EN,
    DestinyInventoryItemDefinition: DestinyInventoryItemDefinition_EN,
    DestinyHistoricalStatsDefinition: DestinyHistoricalStatsDefinition_JA
  },
  ko: {
    braytech: braytech_EN,
    DestinyInventoryItemDefinition: DestinyInventoryItemDefinition_EN,
    DestinyHistoricalStatsDefinition: DestinyHistoricalStatsDefinition_KO
  },
  pl: {
    braytech: braytech_EN,
    DestinyInventoryItemDefinition: DestinyInventoryItemDefinition_EN,
    DestinyHistoricalStatsDefinition: DestinyHistoricalStatsDefinition_PL
  },
  'pt-br': {
    braytech: braytech_EN,
    DestinyInventoryItemDefinition: DestinyInventoryItemDefinition_EN,
    DestinyHistoricalStatsDefinition: DestinyHistoricalStatsDefinition_PTBR
  },
  ru: {
    braytech: braytech_EN,
    DestinyInventoryItemDefinition: DestinyInventoryItemDefinition_EN,
    DestinyHistoricalStatsDefinition: DestinyHistoricalStatsDefinition_RU
  },
  'zh-chs': {
    braytech: braytech_EN,
    DestinyInventoryItemDefinition: DestinyInventoryItemDefinition_EN,
    DestinyHistoricalStatsDefinition: DestinyHistoricalStatsDefinition_ZHCHT
  },
  'zh-cht': {
    braytech: braytech_EN,
    DestinyInventoryItemDefinition: DestinyInventoryItemDefinition_EN,
    DestinyHistoricalStatsDefinition: DestinyHistoricalStatsDefinition_ZHCHT
  }
};

const customsMerge = (bungie, customs) => {
  for (const key in customs) {
    if (customs.hasOwnProperty(key) && bungie.hasOwnProperty(key)) {
      bungie[key] = merge(bungie[key], customs[key]);
    }
  }

  return bungie;
};

const manifest = {
  set: (newManifest, lang) => {
    newManifest.BraytechDefinition = customs[lang].braytech;
    newManifest.DestinyHistoricalStatsDefinition = customs[lang].DestinyHistoricalStatsDefinition;
    newManifest.DestinyClanBannerDefinition = customs.en.DestinyClanBannerDefinition;

    // Object.assign(newManifest.DestinyActivityDefinition, customs.en.DestinyActivityDefinition);

    customsMerge(newManifest.DestinyActivityDefinition, customs.en.DestinyActivityDefinition);

    Object.assign(newManifest.DestinyPresentationNodeDefinition, customs.en.DestinyPresentationNodeDefinition);

    Object.assign(newManifest.DestinyInventoryItemDefinition, customs[lang].DestinyInventoryItemDefinition);

    // add emotes to flair presentation node
    // if (newManifest.DestinyPresentationNodeDefinition[3066887728] && newManifest.DestinyPresentationNodeDefinition[3066887728].children && newManifest.DestinyPresentationNodeDefinition[3066887728].children.presentationNodes) {
    //   newManifest.DestinyPresentationNodeDefinition[3066887728].children.presentationNodes.push({
    //     presentationNodeHash: 'emotes'
    //   });
    // }

    // build Enigmatic Blueprint quest line
    if (newManifest.DestinyInventoryItemDefinition[2412366792]) {
      newManifest.DestinyInventoryItemDefinition['2412366792_enigmatic_blueprint'] = {
        displayProperties: {
          description: newManifest.DestinyInventoryItemDefinition[2412366792].displayProperties && newManifest.DestinyInventoryItemDefinition[2412366792].displayProperties.description,
          name: newManifest.DestinyInventoryItemDefinition[2412366792].displayProperties && newManifest.DestinyInventoryItemDefinition[2412366792].displayProperties.name,
        },
        objectives: {
          objectiveHashes: newManifest.DestinyInventoryItemDefinition[2412366792].objectives && newManifest.DestinyInventoryItemDefinition[2412366792].objectives.objectiveHashes
        },
        hash: '2412366792_enigmatic_blueprint'
      };
    }

    // override brother vance's destinationHash
    if (newManifest.DestinyVendorDefinition[2398407866].locations && newManifest.DestinyVendorDefinition[2398407866].locations.length && newManifest.DestinyVendorDefinition[2398407866].locations[0]) newManifest.DestinyVendorDefinition[2398407866].locations[0].destinationHash = 1993421442;

    // adjusted Mercury destinstion name to Fields of Glass because it's cute
    if (newManifest.DestinyDestinationDefinition[1993421442] && newManifest.DestinyDestinationDefinition[1993421442].displayProperties && newManifest.DestinyCollectibleDefinition[259147459] && newManifest.DestinyCollectibleDefinition[259147459].displayProperties && newManifest.DestinyCollectibleDefinition[259147459].displayProperties.name && newManifest.DestinyCollectibleDefinition[259147459].displayProperties.name !== '') newManifest.DestinyDestinationDefinition[1993421442].displayProperties.name = newManifest.DestinyCollectibleDefinition[259147459].displayProperties.name;

    Object.assign(manifest, newManifest);
  }
};

export default manifest;
