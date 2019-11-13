import * as ls from '../localStorage';

let lsState = ls.get('setting.maps') ? ls.get('setting.maps') : false;

export default function reducer(prevState = lsState, action) {
  switch (action.type) {
    case 'SET_MAPS':

      const state = {
        debug: false,
        noScreenshotHighlight: false,
        logDetails: false,
        ...prevState,
        ...action.payload
      }
      
      ls.set('setting.maps', state);
      
      return state;
    default:      
      return prevState;
  }
}
