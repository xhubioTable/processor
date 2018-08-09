'use strict'

import { DataGeneratorInterface } from '@xhubioTable/data-generator'

/**
 * This generator is only used for the process test.
 * It takes the value given as an argument and returns it
 */

export default class GeneratorArgs extends DataGeneratorInterface {
  /**
   * @see  DataGeneratorInterface._doGenerate
   */
  // eslint-disable-next-line no-unused-vars
  _doGenerate(instanceId, testcase, meta, args) {
    return args
  }
}
