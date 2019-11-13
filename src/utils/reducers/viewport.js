export default function reducer(state = false, action) {
  switch (action.type) {
    case 'VIEWPORT_CHANGED':
      return action.payload;
    default:
      return state;
  }
}
