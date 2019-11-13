import store from './reduxStore';
import * as bungie from './bungie';
import * as responseUtils from './responseUtils';

export async function getGroupMembers(group, getPending = false) {
  store.dispatch({
    type: 'GROUP_MEMBERS_LOADING'
  });

  let groupMembersResponse = await bungie.GetMembersOfGroup(group.groupId);
  let groupMembersPendingResponse = getPending ? await bungie.GetPendingMemberships(group.groupId) : false;

  let memberResponses = groupMembersResponse && groupMembersResponse.ErrorCode === 1 && await Promise.all(
    groupMembersResponse.Response.results.map(async member => {
      try {
        const profile = await bungie.GetProfile({
          params: {
            membershipType: member.destinyUserInfo.membershipType,
            membershipId: member.destinyUserInfo.membershipId,
            components: [100, 200, 202, 204, 900, 1000].join(',')
          },
          errors: {
            hide: true
          }
        });

        if (profile && profile.ErrorCode === 1 && profile.Response) {
          if (!profile.Response.characterProgressions.data) {
            return member;
          }

          member.profile = responseUtils.profileScrubber(profile.Response);
        }

        return member;
      } catch (e) {
        member.profile = false;
        return member;
      }
    })
  );

  let pendingResponses = groupMembersPendingResponse && groupMembersPendingResponse.ErrorCode === 1 && await Promise.all(
    groupMembersPendingResponse.Response.results.map(async member => {
      try {
        const profile = await bungie.GetProfile({
          params: {
            membershipType: member.destinyUserInfo.membershipType,
            membershipId: member.destinyUserInfo.membershipId,
            components: [100, 200, 202, 204, 900, 1000].join(',')
          },
          errors: {
            hide: true
          }
        });

        if (profile && profile.ErrorCode === 1 && profile.Response) {
          if (!profile.Response.characterProgressions.data) {
            return member;
          }

          member.profile = responseUtils.profileScrubber(profile.Response);

          member.pending = true;
        }

        return member;
      } catch (e) {
        member.profile = false;

        member.pending = true;

        return member;
      }
    })
  );

  let payload = {
    groupId: group.groupId,
    members: memberResponses || [],
    pending: pendingResponses || [],
    lastUpdated: new Date().getTime()
  };

  store.dispatch({
    type: 'GROUP_MEMBERS_LOADED',
    payload
  });

  return true;
}

export default getGroupMembers;
