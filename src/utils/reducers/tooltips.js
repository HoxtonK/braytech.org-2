import * as ls from '../localStorage';

let lsState = ls.get('setting.tooltips') ? ls.get('setting.tooltips') : { detailedMode: false };
let defState = {
  settings: lsState,
  itemComponents: [],
  bindTime: new Date().getTime()
};

export default function reducer(state = defState, action) {
  switch (action.type) {
    case 'SET_TOOLTIPS_DESIGN':
      ls.set('setting.tooltips', action.payload);
      return {
        ...state,
        settings: action.payload
      };
    case 'PUSH_INSTANCE':
      let itemComponents = {
        ...state.itemComponents,
        ...action.payload
      };
      return {
        ...state,
        itemComponents
      };
    case 'REBIND_TOOLTIPS':
      return {
        ...state,
        bindTime: action.payload
      };
    default:
      return state;
  }
}
