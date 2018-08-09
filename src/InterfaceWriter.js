import { getLoggerMemory } from '@xhubioTable/logger'

export default class InterfaceWriter {
  constructor(opts = {}) {
    this.logger = opts.logger || getLoggerMemory()
  }

  /**
   * This method will be called before the first testcase will be processed
   */
  before() {
    // eslint-disable-next-line no-console
    console.log(`Start a new processing`)
  }

  /**
   * This method should write the test case data
   * @param testcaseData {object} The TestcaseData object of the processor
   */
  // eslint-disable-next-line no-unused-vars
  write(testcaseData) {
    // eslint-disable-next-line no-console
    console.log(
      `Write testcase '${testcaseData.name}' for table '${
        testcaseData.tableName
      }'`
    )
  }

  /**
   * This method will be called after the last testcase has been processed
   */
  after() {
    // eslint-disable-next-line no-console
    console.log(`End processing`)
  }
}
