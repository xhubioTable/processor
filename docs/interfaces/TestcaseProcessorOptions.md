[**@xhubiotable/processor**](../README.md)

***

[@xhubiotable/processor](../globals.md) / TestcaseProcessorOptions

# Interface: TestcaseProcessorOptions

Defined in: [TestcaseProcessor.ts:33](https://github.com/xhubioTable/processor/blob/dd9cd7bf88ca5f4aa82c6b7600a42543cf46c289/src/TestcaseProcessor.ts#L33)

## Properties

### generatorRegistry

> **generatorRegistry**: `DataGeneratorRegistry`

Defined in: [TestcaseProcessor.ts:38](https://github.com/xhubioTable/processor/blob/dd9cd7bf88ca5f4aa82c6b7600a42543cf46c289/src/TestcaseProcessor.ts#L38)

The registry containing all the data generators

***

### logger?

> `optional` **logger**: `LoggerInterface`

Defined in: [TestcaseProcessor.ts:41](https://github.com/xhubioTable/processor/blob/dd9cd7bf88ca5f4aa82c6b7600a42543cf46c289/src/TestcaseProcessor.ts#L41)

The logger to use

***

### tables

> **tables**: `Record`\<`string`, `TableInterface`\>

Defined in: [TestcaseProcessor.ts:50](https://github.com/xhubioTable/processor/blob/dd9cd7bf88ca5f4aa82c6b7600a42543cf46c289/src/TestcaseProcessor.ts#L50)

Stores all the tables by there name

***

### writeMetaData?

> `optional` **writeMetaData**: `DataWriterFunctionField`

Defined in: [TestcaseProcessor.ts:44](https://github.com/xhubioTable/processor/blob/dd9cd7bf88ca5f4aa82c6b7600a42543cf46c289/src/TestcaseProcessor.ts#L44)

A function to transfer the data from a Todo into the TestcaseData object

***

### writer

> **writer**: [`InterfaceWriter`](InterfaceWriter.md)[]

Defined in: [TestcaseProcessor.ts:35](https://github.com/xhubioTable/processor/blob/dd9cd7bf88ca5f4aa82c6b7600a42543cf46c289/src/TestcaseProcessor.ts#L35)

All the writer used to write the data of the test cases

***

### writeStaticData?

> `optional` **writeStaticData**: `DataWriterFunctionStatic`

Defined in: [TestcaseProcessor.ts:47](https://github.com/xhubioTable/processor/blob/dd9cd7bf88ca5f4aa82c6b7600a42543cf46c289/src/TestcaseProcessor.ts#L47)

A function to transfer the data from a Todo into the TestcaseData object
