import store from './reduxStore';
import * as bungie from './bungie';

export async function getPGCR(membershipId, id) {
  store.dispatch({ type: 'PGCR_LOADING' });

  try {
    let response = await bungie.PGCR(id);

    if (response && response.ErrorCode === 1) {
      
      response.Response.instanceId = id;
    
      store.dispatch({ type: 'PGCR_LOADED', payload: { membershipId, response: response.Response } });

    } else {

    }

  } catch (e) {
    console.warn(`PGCR ${id}`, e)
  }

  return true;
}

export default getPGCR;
