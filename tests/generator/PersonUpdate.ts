import {
  DataGeneratorBase,
  DataGeneratorGenerateRequest
} from '@xhubiotable/data-generator'

/**
 * This generator is only used for the process test.
 * It takes the value from the testcase and build an email out of it
 */
export class GeneratorMyPerson extends DataGeneratorBase {
  async generate(request: DataGeneratorGenerateRequest) {
    const { instanceId, testcaseData, todoGenerator } = request
    if (todoGenerator !== undefined) {
      const args = todoGenerator.config

      if (instanceId && this.instanceData.has(instanceId + args)) {
        return this.instanceData.get(instanceId + args)
      }
      const genData = await this.doGenerate({
        instanceId: `${instanceId}${args}`,
        testcaseData,
        todoGenerator
      })
      if (genData !== undefined && instanceId) {
        this.instanceData.set(instanceId + args, genData)
      }
      return genData
    }
  }

  // eslint-disable-next-line require-await
  async doGenerate(request: DataGeneratorGenerateRequest) {
    const { instanceId, testcaseData, todoGenerator } = request

    if (todoGenerator === undefined) {
      throw new Error('Test: todoGenerator must not be undefined')
    }
    const args = todoGenerator.config
    const testcaseMeta = todoGenerator.testcaseMeta

    if (args === undefined) {
      throw new Error(
        JSON.stringify({
          message: `If this generator is called, the name of the method must be given.`,
          testcaseMeta,
          args
        })
      )
    }

    const personData = testcaseData.data[instanceId].Person_no_ref
    if (
      personData !== undefined &&
      (personData['first-name'] !== undefined ||
        personData['last-name'] !== undefined)
    ) {
      return `${personData['first-name'].val}.${personData['last-name'].val}@foo.bar`
    }
    return undefined
  }
}
