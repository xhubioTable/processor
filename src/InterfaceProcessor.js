import { getLoggerMemory } from '@xhubioTable/logger'

export default class InterfaceProcessor {
  constructor(opts = {}) {
    this.logger = opts.logger || getLoggerMemory()

    // all the available tables
    this.tables = opts.tables

    // This registry contains all the registered generators
    this.generatorRegistry = opts.generatorRegistry

    // An Array with all writer. Each testcase will be send to all the writer
    this.writer = opts.writer
  }

  /**
   * Deletes the loaded tables
   * and also the data of the generators
   */
  clear() {
    this.tables = {}
  }

  /**
   * Processes all the tables
   */
  // eslint-disable-next-line no-unused-vars
  process() {
    throw new Error('Implement this method in the derived class')
  }

  /**
   * Processes a single table
   * @param tables {object} All the existing tables
   * @param table {object} The table model. The table to be processed
   */
  // eslint-disable-next-line no-unused-vars
  processTable(table) {
    throw new Error('Implement this method in the derived class')
  }
}
