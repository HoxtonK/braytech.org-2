import Dexie from 'dexie';

const db = new Dexie('braytech');
db.version(1).stores({
  manifest: 'version,value'
});

export default db;
