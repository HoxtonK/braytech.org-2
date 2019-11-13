

/**
 * Generate a comparator from a mapping function.
 *
 * @example
 * // Returns a comparator that compares items by primary stat
 * compareBy((item) => item.primStat.value)
 */
export function compareBy(fn) {
  return (a, b) => {
    const aVal = fn(a);
    const bVal = fn(b);
    
    return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
  };
}