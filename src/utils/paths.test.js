import * as paths from './paths';

test(`removeMemberIds`, () => {
  // Check that we extract member IDs
  expect(paths.removeMemberIds('/2/4611686018438421331/2305843009271614014/account')).toEqual('/account');

  // Check that a redirect loop can be fixed
  expect(paths.removeMemberIds('/2/4611686018438421331/2305843009271614014/2/4611686018438421331/2305843009271614014/account')).toEqual('/account');

  // Check that non-member paths are preserved
  expect(paths.removeMemberIds('/account')).toEqual('/account');

  // Check that long paths are preserved
  expect(paths.removeMemberIds('/2/4611686018438421331/2305843009289815184/triumphs/1664035662/3319885427/3944698977/2900968934')).toEqual('/triumphs/1664035662/3319885427/3944698977/2900968934');
});
