import * as ls from './localStorage';
import * as bungie from './bungie';
import * as responseUtils from './responseUtils';

async function getMember(membershipType, membershipId) {

  const components = [100, 104, 200, 202, 204, 205, 300, 301, 302, 303, 304, 305, 306, 307, 800, 900];
  let withAuth = false;

  try {
    const tokens = ls.get('setting.auth');
    const now = new Date().getTime() + 10000;

    const refreshTokenExpired = tokens && now > new Date(tokens.refresh.expires).getTime();

    if (tokens && tokens.destinyMemberships.find(m => m.membershipId === membershipId) && !refreshTokenExpired) {
      withAuth = true;
      components.push(102,103,201);
    }
  } catch (e) {
    console.log(e);
  }

  try {
    const requests = [
      bungie.GetProfile({
        params: {
          membershipType,
          membershipId,
          components: components.join(',')
        },
        withAuth
      }), 
      bungie.GetGroupsForMember({
        params: {
          membershipType,
          membershipId
        }
      }), 
      bungie.GetPublicMilestones()
    ];

    const [profile, groups, milestones] = await Promise.all(requests);
  
    if (profile && profile.ErrorCode && profile.ErrorCode === 1 && profile.Response.profileProgression.data && groups && groups.ErrorCode && groups.ErrorCode === 1 && milestones && milestones.ErrorCode && milestones.ErrorCode === 1) {

      return {
        profile: {
          ...profile,
          Response: responseUtils.profileScrubber(profile.Response, 'activity')
        },
        groups: {
          ...profile,
          Response: responseUtils.groupScrubber(groups.Response)
        },
        milestones
      };
    } else {
      
      return {
        profile,
        groups,
        milestones
      };
    }
    
  } catch (e) {
    console.log(e)
    return false;
  }
    
}

export default getMember;
