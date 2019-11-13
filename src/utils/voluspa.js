export function store(payload) {
  try {
    fetch('https://voluspa.braytech.org/enqueue/store', {
      method: 'POST',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
  } catch (e) {}
}

export async function statistics(payload) {
  try {
    const request = await fetch('https://voluspa.braytech.org/statistics', {
      method: 'GET',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(r => r.json());

    return request.Response.data;
  } catch (e) {}
}

class VoluspaError extends Error {
  constructor(request) {
    super(request.Message);

    this.errorCode = request.ErrorCode;
    this.errorStatus = request.ErrorStatus;
  }
}

export async function leaderboard(sort = 'triumphScore', offset = 0, limit = 10) {
  try {
    const request = await fetch(`https://voluspa.braytech.org/leaderboards/?sort=${sort}&limit=${limit}&offset=${offset}`).then(r => r.json());

    if (request.ErrorCode !== 1) {
      throw new VoluspaError(request);
    }

    return request.Response;
  } catch (e) {}
}

export async function leaderboardGroup(groupId = false, sort = 'triumphScore') {
  if (!groupId) {
    return {};
  }

  try {
    const request = await fetch(`https://voluspa.braytech.org/leaderboards/?groupId=${groupId}&sort=${sort}`).then(r => r.json());

    if (request.ErrorCode !== 1) {
      throw new VoluspaError(request);
    }

    return request.Response;
  } catch (e) {}
}

export async function leaderboardPosition(membershipType = false, membershipId = false) {
  if (!membershipType || !membershipId) {
    return {};
  }

  try {
    const request = await fetch(`https://voluspa.braytech.org/leaderboards/position?membershipType=${membershipType}&membershipId=${membershipId}`).then(r => r.json());

    if (request.ErrorCode !== 1) {
      throw new VoluspaError(request);
    }

    return request.Response;
  } catch (e) {}
}
