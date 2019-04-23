/**
 * A filter processor is used to filter Test cases in a decision table.
 * A filter is registered with its name at the processor. In the decision table
 * the filter name is referenced. Then the result is filtered with the given
 * filter processor
 */
export default class FilterProcessorInterface {
  constructor(opts = {}) {
    // The name of this filter processor
    this._name = opts.name || 'FilterProcessorInterface'
  }

  /**
   * returns the name of this filter processor
   */
  get name() {
    if (this._name === undefined) {
      throw new Error(`Undefined filter processor name`)
    }
    return this._name
  }

  /**
   * set a new name to this processor
   */
  set name(newName) {
    if (newName === undefined) {
      throw new Error(`A filter processor name must not be undefined`)
    }
    if (typeof newName !== 'string') {
      throw new Error(`A filter processor name must be a string`)
    }
    this._name = newName
  }

  /**
   * This method filters the tags with the given expression
   * @param tags {array} An array with all the tags on the test case
   * @param expression {string} An expression for this filter processor
   * @return true {boolean} returns a true value if the filter processor could filter a result
   */
  // eslint-disable-next-line no-unused-vars
  filter(tags, expression) {
    return false
  }
}
