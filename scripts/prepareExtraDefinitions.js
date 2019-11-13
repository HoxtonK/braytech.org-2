// Used to extract node information from lowlines' helpful API endpoint
// at https://lowlidev.com.au/destiny/api/v2/map/supported so that we don't
// need to embed the entire file inside the application.

const fs = require('fs');
const fetch = require('node-fetch');

const outputPath = lang => `src/data/manifest/${lang}/DestinyHistoricalStatsDefinition/index.json`;

const historicalStatsGambit = JSON.parse(fs.readFileSync('./src/data/historicalStatsGambit/index.json'));

let langs = [];

function historicalStats() {
  langs.forEach(lang => {
    try {
      fetch(`https://api.tyra-karn.com/DestinyManifest/mobileWorldContentPaths/${lang}/DestinyHistoricalStatsDefinition`, {
        headers: {
          accept: 'application/json'
        }
      })
        .then(res => res.json())
        .catch(e => console.warn(`${lang}: ${e}`))
        .then(json => {
          let rewire = {};
          json._embedded.results.forEach(m => {
            if ((!m.iconImage || m.iconImage === '') && historicalStatsGambit[m.statId] && historicalStatsGambit[m.statId].iconImage) {
              m.iconImage = `/static/images/extracts/medals/gambit/${historicalStatsGambit[m.statId].iconImage}`;
              m.localIcon = true;
            }
            rewire[m.statId] = m;
          });
          fs.writeFileSync(outputPath(lang), JSON.stringify(rewire), { flag: 'w' });
        });
    } catch (e) {
      console.warn(`${lang}: ${e}`);
    }
  });
}

fetch(`https://api.tyra-karn.com/DestinyManifest/`, {
  headers: {
    accept: 'application/json'
  }
})
  .then(res => res.json())
  .then(json => {
    langs = Object.keys(json.jsonWorldContentPaths);
    historicalStats();
  });

fetch(`https://api.tyra-karn.com/DestinyManifest/mobileClanBannerDatabasePath`, {
  headers: {
    accept: 'application/json'
  }
})
  .then(res => res.json())
  .then(json => {
    fs.writeFileSync(`src/data/manifest/en/DestinyClanBannerDefinition/index.json`, JSON.stringify(json._embedded), { flag: 'w' });
  });
