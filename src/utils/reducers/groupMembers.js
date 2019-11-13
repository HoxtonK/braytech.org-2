const defaultState = {
  groupId: false,
  members: [],
  pending: [],
  loading: false,
  lastUpdated: 0
};

export default function reducer(state = defaultState, action) {
  switch (action.type) {
    case 'GROUP_MEMBERS_LOADING':
      return {
        ...state,
        loading: true
      };
    case 'GROUP_MEMBERS_LOADED':
      return {
        ...state,
        ...action.payload,
        loading: false
      };
    default:
      return state;
  }
}
