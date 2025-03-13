/**
 * Creates defaults for fileProcessor, writer and generator registry.
 * These defaults are not usefull for production, but for starting and testing.
 */

import fs from 'node:fs/promises'
import path from 'node:path'

import { DataGeneratorRegistry } from '@tlink/data-generator'
import { InterfaceWriter } from './InterfaceWriter'
import {
  FileProcessor,
  ParserMatrix,
  ParserDecision,
  ParserSpecification
} from '@tlink/file-processor'

import { ImporterXlsx } from '@tlink/importer-xlsx'
import { LoggerInterface } from '@tlink/logger'
import { TestcaseDataInterface } from './TestcaseDataInterface'

export function createDefaultGeneratorRegistry() {
  return new DataGeneratorRegistry()
}

export function createDefaultWriter(logger: LoggerInterface) {
  return [new DefaultWriter({ logger })]
}

export function createDefaultFileProcessor(logger: LoggerInterface) {
  const importer = new ImporterXlsx()
  const parserMatrix = new ParserMatrix({ logger })
  const parserDecision = new ParserDecision({ logger })
  const parserSpecification = new ParserSpecification({ logger })

  const fileProcessor = new FileProcessor({ logger })

  fileProcessor.registerImporter('xlsx', importer)
  fileProcessor.registerImporter('xls', importer)

  fileProcessor.registerParser('<DECISION_TABLE>', parserDecision)
  fileProcessor.registerParser('<MATRIX_TABLE>', parserMatrix)
  fileProcessor.registerParser('<SPECIFICATION_TABLE>', parserSpecification)

  return fileProcessor
}

class DefaultWriter implements InterfaceWriter {
  logger: LoggerInterface

  constructor(opts: { logger: LoggerInterface }) {
    this.logger = opts.logger
  }

  before(): Promise<void> {
    throw new Error('Method not implemented.')
  }
  after(): Promise<void> {
    throw new Error('Method not implemented.')
  }
  /**
   * Writes the data
   */
  async write(testcaseData: TestcaseDataInterface): Promise<void> {
    const fileName = this.createFileName(testcaseData)
    await fs.writeFile(fileName, JSON.stringify(testcaseData, null, 2))
  }

  /**
   * Creates the file name to write the testcaseData object
   * @param testcaseData - The testcaseData object
   * @returns The file name to write the object
   */
  createFileName(testcaseData: TestcaseDataInterface): string {
    const tcName = testcaseData.name
    const targetDir = path.join('tdg', tcName)
    return path.join(targetDir, 'testcaseData.json')
  }
}
