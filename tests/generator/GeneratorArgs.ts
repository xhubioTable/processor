import {
  DataGeneratorBase,
  DataGeneratorGenerateRequest
} from '@xhubiotable/data-generator'

/**
 * This generator is only used for the process test.
 * It takes the value given as an argument and returns it
 */

export class GeneratorArgs extends DataGeneratorBase {
  // eslint-disable-next-line require-await
  async doGenerate(request: DataGeneratorGenerateRequest) {
    if (request.todoGenerator !== undefined) {
      return request.todoGenerator.config
    }
  }
}
