'use strict'

import { DataGeneratorInterface } from '@xhubiotable/data-generator'

/**
 * This generator is only used for the process test.
 * It takes the value from the testcase and build an email out of it
 */

export default class GeneratorPostProcess extends DataGeneratorInterface {
  /**
   * @see  DataGeneratorInterface._doGenerate
   */
  // eslint-disable-next-line no-unused-vars
  _doGenerate(instanceId, testcase, meta, args) {
    return `<GeneratorPostProcess>`
  }

  // eslint-disable-next-line no-unused-vars
  postProcess(instanceId, testcaseData, todo, parameter) {
    if (this.genCalls === undefined) {
      this.genCalls = []
    }
    this.genCalls.push(todo.name)
  }
}
