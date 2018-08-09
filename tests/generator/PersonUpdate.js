'use strict'
import assert from 'assert'
import { DataGeneratorInterface } from '@xhubioTable/data-generator'

/**
 * This generator is only used for the process test.
 * It takes the value from the testcase and build an email out of it
 */
export default class GeneratorMyPerson extends DataGeneratorInterface {
  /**
   * Generates the value and saves it for the given instance.
   * @param instanceId {string} The testcase instance id. for the same instance id the same data object
   * will be returned. If this i undefined then always a new value will be created.
   * @param testcase {object} The already generated testcase object.
   * @param args {object/string} Any arguments the generator may need
   * @returns data {object} The genrated data. If the data could not be generated because of missing data
   * then the generator should return 'undefined'. So it could be called later. This may be the case if the generator
   * needs referenced data which is not generated yet.
   */
  generate(instanceId, testcase, meta, args) {
    assert.ok(instanceId)
    assert.ok(testcase)
    assert.ok(testcase.data)
    assert.ok(args)
    if (instanceId && this.instanceData.has(instanceId + args)) {
      return this.instanceData.get(instanceId + args)
    }
    const genData = this._doGenerate(instanceId + args, testcase, meta, args)
    if (genData !== undefined && instanceId) {
      this.instanceData.set(instanceId + args, genData)
    }
    return genData
  }

  /**
   * @see  DataGeneratorInterface._doGenerate
   */
  // eslint-disable-next-line no-unused-vars
  _doGenerate(instanceId, testcase, meta, args) {
    if (args === undefined) {
      throw new Error({
        message: `If this generator is called, the name of the method must be given.`,
        meta,
        args,
      })
    }

    const personData = testcase.data[instanceId].Person_no_ref
    if (
      personData !== undefined &&
      (personData['first-name'] !== undefined ||
        personData['last-name'] !== undefined)
    ) {
      return `${personData['first-name'].val}.${
        personData['last-name'].val
      }@foo.bar`
    }
    return undefined
  }
}
