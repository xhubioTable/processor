/**
 * This test tests the decision table model.
 * The test is located in the processor because we need to load an excel file
 * for this test.
 */

import fs from 'node:fs/promises'
import path from 'node:path'
import { ImporterXlsx } from '@tlink/importer-xlsx'
import { ParserDecision, FileProcessor } from '@tlink/file-processor'
import { getLoggerMemory } from '@tlink/logger'
import { TableDecision } from '@tlink/model-decision'

const FIXTURES = path.join(__dirname, 'fixtures')
const VOLATILE = path.join(__dirname, 'volatile', 'TableDecision')

beforeAll(async () => {
  await fs.rm(VOLATILE, { recursive: true, force: true })
  await fs.mkdir(VOLATILE, { recursive: true })
})

const dataFile = path.join(
  FIXTURES,
  'decision_table_data_for_model_decision.xls'
)

const logger = getLoggerMemory()
logger.clear()
logger.writeConsole = false

test('createTodos', async () => {
  const importer = new ImporterXlsx()
  const parser = new ParserDecision({ logger })

  const fileProcessor = new FileProcessor({ logger })
  fileProcessor.registerImporter('xlsx', importer)
  fileProcessor.registerImporter('xls', importer)
  fileProcessor.registerParser('<DECISION_TABLE>', parser)
  fileProcessor.registerParser('<MATRIX_TABLE>', parser)
  await fileProcessor.load([dataFile])

  const tables = fileProcessor.tables
  const table = tables[0]

  // update the calculation
  if (table instanceof TableDecision) {
    table.calculate()
  }
  const tc1 = table.getTestcaseForName('1')
  const todos = tc1.createTodos()

  expect(todos.generator).toEqual([
    {
      fieldName: 'password',
      generatorName: 'password',
      config: '{"val": "toShort"}',
      instanceIdSuffix: '',
      order: 1000,
      testcaseMeta: {
        fileName: path.join(
          FIXTURES,
          'decision_table_data_for_model_decision.xls'
        ),
        tableName: 'myTable',
        tableType: 'decision-table',
        testcaseName: '1'
      }
    }
  ])

  expect(todos.field).toEqual([
    {
      fieldName: 'Result',
      comment: 'Comment 1',
      key: 'Error',
      other: undefined,
      testcaseMeta: {
        fileName: path.join(
          FIXTURES,
          'decision_table_data_for_model_decision.xls'
        ),
        tableName: 'myTable',
        tableType: 'decision-table',
        testcaseName: '1'
      }
    },
    {
      fieldName: 'Result',
      comment: 'Comment 4',
      key: 'Error',
      other: undefined,
      testcaseMeta: {
        fileName: path.join(
          FIXTURES,
          'decision_table_data_for_model_decision.xls'
        ),
        tableName: 'myTable',
        tableType: 'decision-table',
        testcaseName: '1'
      }
    }
  ])

  expect(todos.reference).toEqual([
    {
      fieldName: 'Password 2',
      instanceIdSuffix: '',
      targetFieldName: 'field1',
      targetTableName: 'gumTable',
      targetTestcaseName: 'tc3',
      testcaseMeta: {
        fileName: path.join(
          FIXTURES,
          'decision_table_data_for_model_decision.xls'
        ),
        tableName: 'myTable',
        tableType: 'decision-table',
        testcaseName: '1'
      }
    }
  ])

  expect(todos.static).toEqual([
    {
      fieldName: 'userId',
      testcaseMeta: {
        fileName: path.join(
          FIXTURES,
          'decision_table_data_for_model_decision.xls'
        ),

        tableName: 'myTable',
        tableType: 'decision-table',
        testcaseName: '1'
      },
      value: '<EMPTY>'
    }
  ])
})
