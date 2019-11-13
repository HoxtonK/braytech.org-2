const defaultState = {};

export default function reducer(state = defaultState, action) {
  switch (action.type) {
    case 'PGCR_LOADING':
      return {
        ...state,
        loading: true
      };
    case 'PGCR_LOADED':
      let newState = {
        ...state,
        loading: false
      };
      newState[action.payload.membershipId] = newState[action.payload.membershipId] || [];
      newState[action.payload.membershipId] = newState[action.payload.membershipId].concat([action.payload.response]);
      return newState;
    default:
      return state;
  }
}
