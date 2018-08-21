import path from 'path'

// eslint-disable-next-line no-unused-vars
import jsonfile from 'jsonfile'

import { getLoggerMemory } from '@xhubioTable/logger'
import { createOpts } from './Helper'

/**
 * Executes the test for the testcase processor of decision tables
 * @param excelFileName {string} The name of the excel file relatve to 'fixtures' dir
 * @param excelTableNames {array} All the table names to be loaded from that excel file
 * @param expected {object} The expected data
 * @param expectFunction {function} A function, if given the compare will be done by this function
 * @param tableName {string} The name of the table where the testcase shiuld be executed
 */
export function executeTest(testOptions) {
  const { excelFileName, excelTableNames, validator, tableName } = testOptions

  // Clear the log entries
  const logger = getLoggerMemory()
  logger.clear()
  logger.writeConsole = false

  // Excel file to load
  const fixturesDir = path.join(__dirname, 'fixtures')
  const dataFileName = path.join(fixturesDir, excelFileName)

  // prepare the test name
  const tableNames = excelTableNames.join(', ')
  const testName = `DECISION: Test generated data for table '${excelFileName}' tables: ${tableNames}`
  test(testName, async () => {
    // Create the testcase processor with all the data needed
    const opts = await createOpts(excelTableNames, [dataFileName])
    const processor = opts.processor

    const result = {}

    const writer = {
      before: () => {},
      write: testcaseData => {
        if (result[testcaseData.tableName] === undefined) {
          result[testcaseData.tableName] = {}
        }
        result[testcaseData.tableName][testcaseData.name] = testcaseData
      },
      after: () => {},
    }

    // get the loaded table models
    processor.tables = opts.tables
    processor.writer = [writer]

    // get the entry table
    const table = opts.tables[tableName]

    // call the processor
    processor.processTable(table)

    // log all the errors
    logger.entries.error.forEach(error => {
      // eslint-disable-next-line no-console
      console.log(JSON.stringify(error, null, 2))
    })

    validator.validate(result)
  })
}
