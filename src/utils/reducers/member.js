import store from '../reduxStore';
import getMember from '../getMember';
import * as voluspa from '../voluspa';

const defaultState = {
  membershipType: false,
  membershipId: false,
  characterId: false,
  data: false,
  prevData: false,
  loading: false,
  stale: false,
  error: false
};

// Wrapper function for loadMember that lets it run asynchronously, but
// means we don't have to add `async` to our reducer (which is bad)
function loadMemberAndReset(membershipType, membershipId, characterId) {
  loadMember(membershipType, membershipId, characterId);
  return {
    membershipId,
    membershipType,
    characterId: characterId || null,
    data: false,
    prevData: false,
    error: false,
    stale: false,
    loading: true
  };
}

async function loadMember(membershipType, membershipId, characterId) {
  // Note: while calling store.dispatch from within a reducer is an anti-pattern,
  // calling one asynchronously (eg as a result of a fetch) is just fine.
  
  try {
    const data = await getMember(membershipType, membershipId);

    if (data.profile && data.profile.ErrorCode === 1 && !data.profile.Response.profileProgression.data) {
      store.dispatch({ type: 'MEMBER_LOAD_ERROR', payload: { membershipId, membershipType, error: { ErrorCode: 'private' } } });

      return;
    }

    // console.log('member reducer', data);

    ['profile', 'groups', 'milestones'].forEach(key => {
      
      if (!data[key].ErrorCode || data[key].ErrorCode !== 1) {
        
        store.dispatch({ type: 'MEMBER_LOAD_ERROR', payload: { membershipId, membershipType, error: { ...data[key] } } });
  
        throw Error('SILENT');
      }
    });    

    store.dispatch({
      type: 'MEMBER_LOADED',
      payload: {
        membershipId,
        membershipType,
        characterId,
        data: {
          profile: data.profile.Response,
          groups: data.groups.Response,
          milestones: data.milestones.Response
        }
      }
    });

    voluspa.store({ membershipId, membershipType });

  } catch (error) {

    if (error.message !== 'SILENT') {
      store.dispatch({ type: 'MEMBER_LOAD_ERROR', payload: { membershipId, membershipType, error } });
    }

    return;
  }
}

export default function memberReducer(state = defaultState, action) {
  if (!action.payload) return state;

  const { membershipId, characterId, data, error } = action.payload;

  // Sometimes a number - let's just make it a string all the time
  const membershipType = action.payload.membershipType && action.payload.membershipType.toString();

  if (action.type === 'MEMBER_SET_BY_PROFILE_ROUTE') {
    const membershipLoadNeeded = (!state.data && !state.loading) || state.membershipId !== membershipId || state.membershipType !== membershipType;

    // If our data doesn't exist and isn't currently loading, or if our
    // new membership ID / type doesn't match what we already have stored,
    // reset everything and trigger a reload.
    if (membershipLoadNeeded) return loadMemberAndReset(membershipType, membershipId, characterId);

    // Otherwise, make sure the character ID is in sync with what we're being
    // told by the profile route. In most cases this will be a no-op.
    return { ...state, characterId };
  }

  if (action.type === 'MEMBER_LOAD_MEMBERSHIP') {
    return loadMemberAndReset(membershipType, membershipId, characterId);
  }

  // We send the membership type & membership ID along with all member
  // dispatches to make sure that multiple async actions on different members
  // don't stomp on each other - eg a user searches for one member, clicks it, then
  // searches for another and clicks it before the first is finished loading.
  const membershipMatches = membershipType === state.membershipType && membershipId === state.membershipId;
  if (!membershipMatches) {
    // console.warn(action.payload);
    return state;
  }

  switch (action.type) {
    case 'MEMBER_CHARACTER_SELECT':
      return {
        ...state,
        characterId
      };
    case 'MEMBER_LOAD_ERROR':
      return {
        ...state,
        loading: false,
        error
      };
    case 'MEMBER_LOADED':
      if (state.prevData !== data) data.updated = new Date().getTime();
      // console.log(characterId);
      return {
        ...state,
        characterId: state.characterId ? state.characterId : data.profile.characters.data[0].characterId,
        data: { ...state.data, ...data },
        prevData: state.data,
        loading: false,
        stale: false,
        error: false
      };
    case 'MEMBER_IS_STALE':
      return {
        ...state,
        stale: true
      };
    default:
      return state;
  }
}
