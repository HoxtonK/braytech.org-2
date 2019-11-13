import { createStore, combineReducers } from 'redux';

import theme from './reducers/theme.js';
import member from './reducers/member.js';
import groupMembers from './reducers/groupMembers.js';
import notifications from './reducers/notifications.js';
import refreshService from './reducers/refreshService.js';
import PGCRcache from './reducers/PGCRcache.js';
import triumphs from './reducers/triumphs.js';
import tooltips from './reducers/tooltips.js';
import collectibles from './reducers/collectibles.js';
import viewport from './reducers/viewport.js';
import maps from './reducers/maps.js';

const rootReducer = combineReducers({
  theme,
  member,
  groupMembers,
  notifications,
  refreshService,
  PGCRcache,
  triumphs,
  tooltips,
  collectibles,
  viewport,
  maps
});

const store = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ &&
    window.__REDUX_DEVTOOLS_EXTENSION__({
      actionsBlacklist: [],
      // trace: true
    })
);

export default store;
