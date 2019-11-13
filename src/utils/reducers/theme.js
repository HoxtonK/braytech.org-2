import * as ls from '../localStorage';

let lsState = ls.get('setting.theme') ? ls.get('setting.theme') : false;
lsState = lsState && lsState.selected ? lsState : { selected: 'light-mode' };

function updateScrollbars(selected) {
  let root = document.documentElement;
  if (selected === 'dark-mode') {
    root.style.setProperty('--scrollbar-track', '#202020');
    root.style.setProperty('--scrollbar-draggy', '#414141');
  } else {
    root.style.setProperty('--scrollbar-track', '#a7a7a7');
    root.style.setProperty('--scrollbar-draggy', '#cacaca');
  }
}

export default function reducer(state = lsState, action) {
  switch (action.type) {
    case 'SET_THEME':
      ls.set('setting.theme', {
        selected: action.payload
      });

      updateScrollbars(action.payload);
      
      return {
        selected: action.payload
      };
    default:

      updateScrollbars(state.selected);
      
      return state;
  }
}
