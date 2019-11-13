import * as ls from '../localStorage';

const defaultState = ls.get('setting.triumphs')
  ? ls.get('setting.triumphs')
  : {
      tracked: []
    };

export default function reducer(state = defaultState, action) {
  switch (action.type) {
    case 'SET_TRACKED_TRIUMPHS':
      ls.set('setting.triumphs', {
        ...state,
        tracked: action.payload
      });
      return {
        ...state,
        tracked: action.payload
      };
    default:
      return state;
  }
}
