/**
 * Creates defaults for fileProcessor, writer and generator registry.
 * These defaults are not usefull for production, but for starting and testing.
 */

import util from 'util'
import fs from 'fs'
import path from 'path'

import { TDGServiceRegistry } from '@xhubiotable/data-generator'
import InterfaceWriter from './InterfaceWriter'
import {
  FileProcessor,
  ParserMatrix,
  ParserDecision,
  ParserSpecification,
} from '@xhubiotable/file-processor'

import { ImporterXlsx } from '@xhubiotable/importer-xlsx'

const writeFile = util.promisify(fs.writeFile)

export function createDefaultGeneratorRegistry() {
  return new TDGServiceRegistry()
}

export function createDefaultWriter(logger) {
  return [new DefaultWriter({ logger })]
}

export async function createDefaultFileProcessor(logger) {
  const importer = new ImporterXlsx()
  const parserMatrix = new ParserMatrix({ logger })
  const parserDecision = new ParserDecision({ logger })
  const parserSpecification = new ParserSpecification({ logger })

  const fileProcessor = new FileProcessor({ logger })

  await fileProcessor.registerImporter('xlsx', importer)
  await fileProcessor.registerImporter('xls', importer)

  await fileProcessor.registerParser('<DECISION_TABLE>', parserDecision)
  await fileProcessor.registerParser('<MATRIX_TABLE>', parserMatrix)
  await fileProcessor.registerParser(
    '<SPECIFICATION_TABLE>',
    parserSpecification
  )

  return fileProcessor
}

class DefaultWriter extends InterfaceWriter {
  /**
   * Writes the data
   */
  async write(testcaseData) {
    const fileName = await this.createFileName(testcaseData)
    return writeFile(fileName, JSON.stringify(testcaseData, null, 2))
  }

  /**
   * Creates the file name to write the testcaseData object
   * @param testcaseData {object} The testcaseData object
   * @return fileName {string} The file name to write the object
   */
  async createFileName(testcaseData) {
    const tcName = testcaseData.name
    const targetDir = path.join('tdg', tcName)
    return path.join(targetDir, 'testcaseData.json')
  }
}
