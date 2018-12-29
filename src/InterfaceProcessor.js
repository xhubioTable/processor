import { getLoggerMemory } from '@xhubiotable/logger'

export default class InterfaceProcessor {
  constructor(opts = {}) {
    this.logger = opts.logger || getLoggerMemory()

    // all the available tables as an Object
    // key = tableName, value = table
    this._tables = opts.tables !== undefined ? opts.tables : {}

    // This registry contains all the registered generators
    this.generatorRegistry = opts.generatorRegistry

    // An Array with all writer. Each testcase will be send to all the writer
    this.writer = opts.writer
  }

  /**
   * If the given data is an Array it must be converted into an object
   */
  set tables(data) {
    if (Array.isArray(data)) {
      this._tables = {}
      for (const table of data) {
        this._tables[table.name] = table
      }
    } else {
      this._tables = data
    }
  }

  get tables() {
    return this._tables
  }

  /**
   * Deletes the loaded tables
   * and also the data of the generators
   */
  clear() {
    this._tables = {}
  }

  /**
   * Processes all the tables
   */
  // eslint-disable-next-line no-unused-vars
  async process() {
    throw new Error('Implement this method in the derived class')
  }

  /**
   * Processes a single table
   * @param tables {object} All the existing tables
   * @param table {object} The table model. The table to be processed
   */
  // eslint-disable-next-line no-unused-vars
  async processTable(table) {
    throw new Error('Implement this method in the derived class')
  }
}
