const helper = (a, b) =>
  [].concat(...a.map((d) => b.map((e) => [].concat(d, e))))

/**
 * This function builds a cartesian product out of the given arrays
 * @param a {array} An array of elements
 * @param b {array} An array of elements
 * @param ..c {array} further array of elements
 * @return res {array} An array with the cartesian product
 */
export const cartesianProduct = (a, b, ...c) =>
  b ? cartesianProduct(helper(a, b), ...c) : a
