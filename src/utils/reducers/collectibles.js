import * as ls from '../localStorage';

const savedState = ls.get('setting.collectibleDisplayState') ? ls.get('setting.collectibleDisplayState') : {};
const defaultState = {
  hideCompletedRecords: false,
  hideCompletedChecklistItems: false,
  hideInvisibleCollectibles: true,
  hideInvisibleRecords: true,
  hideDudRecords: true,
  hideCompletedCollectibles: false,
  ...savedState
};

export default function reducer(state = defaultState, action) {
  switch (action.type) {
    case 'SET_COLLECTIBLES':
      let newState = {
        ...state,
        ...action.payload
      }

      ls.set('setting.collectibleDisplayState', newState);
      return newState;
    default:
      return state;
  }
}
