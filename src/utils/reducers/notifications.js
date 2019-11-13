import * as ls from '../localStorage';
import notifications from '../../data/notifications';

const history = ls.get('history.notifications') ? ls.get('history.notifications') : [];
const timeAtInit = new Date().getTime();
const defaultState = {
  objects: (notifications && notifications.filter(n => {
    let t = new Date(n.date).getTime();
    if (t < timeAtInit) {
      return true;
    } else {
      return false;
    }
  }).filter(n => !history.includes(n.id))) || [],
  trash: history || []
};

export default function reducer(state = defaultState, action) {
  switch (action.type) {
    case 'PUSH_NOTIFICATION':
      // console.log(action);

      action.payload.id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      
      return {
        ...state,
        objects: state.objects.concat([action.payload])
      };
    case 'POP_NOTIFICATION':
      // console.log(action, state.objects.filter(n => n.id !== action.payload));

      let objToPop = state.objects.find(n => n.id === action.payload);
      if (objToPop && objToPop.showOnce) {
        ls.set('history.notifications', state.trash.concat([action.payload]));
      }

      return {
        ...state,
        objects: state.objects.filter(n => n.id !== action.payload)
      };
    default:
      return state;
  }
}
