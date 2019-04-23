import FilterProcessorInterface from './FilterProcessorInterface'
/**
 * A filter processor is used to filter Test cases in a decision table.
 * A filter is registered with its name at the processor. In the decision table
 * the filter name is referenced. Then the result is filtered with the given
 * filter processor
 *
 * @param name {string} A name for this Filter
 * @param delimiter {string} A delimiter used to split the expression
 */
export default class SimpleArrayFilterProcessor extends FilterProcessorInterface {
  constructor(opts = {}) {
    super(opts)

    // The name of this filter processor
    this._name = opts.name || 'SimpleArrayFilter'

    this.delimiter = opts.delimiter || ';'
  }

  /**
   * This method filters the tags with the given expression
   * @param tags {array} An array with all the tags on the test case
   * @param expression {string} An expression for this filter processor
   * @return true {boolean} returns a true value if the filter processor could filter a result
   */
  filter(tags, expression) {
    const expressions = expression.split(this.delimiter)

    for (let expr of expressions) {
      expr = expr.trim()
      if (expr !== '' && tags.includes(expr)) {
        return true
      }
    }

    return false
  }
}
