/** Given a source path, returns a path without preceding membershiptype/etc
 *
 * Works on redirect loops, so should fix /2/34234/3434/2/342/343/triumphs
 * as well.
 */
export function removeMemberIds(pathname) {
  if (pathname) {
    const linkHasMemberIds = pathname.match(RegExp('^(/\\d/\\d+/\\d+)+(/.+)$'));
    return linkHasMemberIds ? linkHasMemberIds[2] : pathname;
  } else {
    return pathname;
  }
}
