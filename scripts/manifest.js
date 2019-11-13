const fs = require("fs");
const path = require("path");
const fetch = require('node-fetch');

async function request(path) {
  let opts = {
    headers: {
      'x-api-key': 'fabac2ab32e04313a86fb6018268969c'
    }
  };

  return await fetch(`https://www.bungie.net${path}`, opts).then(response => {
    return response;
  }).then(r => {
    return r.json();
  }).catch(e => {
    console.error('[manifest.js] request()');
    console.error(e);
  });
}
  

let cachedManifest = null;
let manifestData = null;

if (fs.existsSync(`./manifest/index.json`)) {
  cachedManifest = JSON.parse(fs.readFileSync(`./manifest/index.json`));

  if (fs.existsSync(`./manifest/json/${path.basename(cachedManifest.jsonWorldContentPaths.en, '.json')}/data.json`)) {
    manifestData = JSON.parse(fs.readFileSync(`./manifest/json/${path.basename(cachedManifest.jsonWorldContentPaths.en, '.json')}/data.json`));
  }

  console.log(`Manifest loaded: ${path.basename(cachedManifest.jsonWorldContentPaths.en, '.json')}`)
}

async function downloadManifest(liveManifest) {
  const response = await request(liveManifest.jsonWorldContentPaths.en);

  manifestData = response;

  const target = `./manifest/json/${path.basename(liveManifest.jsonWorldContentPaths.en, '.json')}`;

  if (!fs.existsSync(target)) {
    await fs.promises.mkdir(target, { recursive: true });
  }

  await fs.promises.writeFile(`${target}/data.json`, JSON.stringify(response), { flag: 'w' });
  await fs.promises.writeFile(`${target}/index.json`, JSON.stringify(liveManifest), { flag: 'w' });
  await fs.promises.writeFile(`./manifest/index.json`, JSON.stringify(liveManifest), { flag: 'w' });

  return response;
}

async function checkManifest() {
  let liveManifest = await request('/Platform/Destiny2/Manifest/');

  if (liveManifest && liveManifest.ErrorCode === 1) liveManifest = liveManifest.Response;

  if (liveManifest) liveManifest.fetched = new Date().toISOString();

  if (!cachedManifest || !manifestData || cachedManifest.jsonWorldContentPaths.en !== liveManifest.jsonWorldContentPaths.en) {
    console.warn('Manifest out of date. Downloading a new one...');

    await downloadManifest(liveManifest);
  } else if (cachedManifest.jsonWorldContentPaths.en === liveManifest.jsonWorldContentPaths.en) {
    console.log('Manifest is up to date.');
  }

  cachedManifest = liveManifest;

}

module.exports = {
  checkManifest,
  getManifest: async () => {
    await checkManifest();
    return manifestData;
  }
};