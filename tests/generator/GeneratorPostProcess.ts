import {
  DataGeneratorBase,
  DataGeneratorGenerateRequest
} from '@xhubiotable/data-generator'
import { TodoGeneratorInterface } from '@xhubiotable/model'

/**
 * This generator is only used for the process test.
 * It takes the value from the testcase and build an email out of it
 */

export class GeneratorPostProcess extends DataGeneratorBase {
  genCalls?: string[]

  // eslint-disable-next-line @typescript-eslint/no-unused-vars,require-await
  async doGenerate(request: DataGeneratorGenerateRequest) {
    return `<GeneratorPostProcess>`
  }

  // eslint-disable-next-line require-await
  async postProcess(
    request: DataGeneratorGenerateRequest
  ): Promise<TodoGeneratorInterface[] | undefined> {
    const { todoGenerator } = request

    if (this.genCalls === undefined) {
      this.genCalls = []
    }
    if (todoGenerator !== undefined) {
      this.genCalls.push(todoGenerator.fieldName)
    }

    return
  }
}
