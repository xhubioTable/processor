import { CallTreeInterface } from '../src/CallTreeInterface'
import { TestcaseDataInterface } from '../src/TestcaseDataInterface'
import { GeneratorPostProcess } from './generator/GeneratorPostProcess'
import { createOpts } from './Helper'

test('postProcessGenerators', async () => {
  // Create the testcase processor with all the data needed
  const opts = await createOpts()
  const processor = opts.processor

  const testcaseMeta = {
    fileName: 'field1',
    tableName: 'table1',
    tableType: 'decision-table',
    testcaseName: 'tc1'
  }

  const testcaseData: TestcaseDataInterface = {
    tableName: 'myTable',
    name: 'myTestcaseName',
    data: {},
    instanceId: 'myInstanceId',
    callTree: {} as CallTreeInterface,

    postProcessTodos: [
      {
        order: 3,
        instanceIdSuffix: 'instId',
        generatorName: 'postProcess',
        config: 'third',
        fieldName: 'third',
        testcaseMeta
      },
      {
        order: 2,
        instanceIdSuffix: 'instId',
        generatorName: 'postProcess',
        config: 'second',
        fieldName: 'second',
        testcaseMeta
      },
      {
        order: 1,
        instanceIdSuffix: 'instId',
        generatorName: 'postProcess',
        config: 'first',
        fieldName: 'first',
        testcaseMeta
      },
      {
        order: 1000,
        instanceIdSuffix: 'instId',
        generatorName: 'postProcess',
        config: 'last',
        fieldName: 'last',
        testcaseMeta
      },
      {
        order: 10,
        instanceIdSuffix: 'instId',
        generatorName: 'postProcess',
        config: 'forth',
        fieldName: 'forth',
        testcaseMeta
      }
    ]
  }

  // call the post processing
  await processor.postProcessGenerators(testcaseData)

  // get the used generator
  const generator = opts.generatorRegistry.getGenerator('postProcess')

  const genCalls = (generator as GeneratorPostProcess).genCalls

  expect(genCalls).toEqual(['first', 'second', 'third', 'forth', 'last'])
})
