[**@tlink/processor**](../README.md)

***

[@tlink/processor](../globals.md) / TestcaseProcessorOptions

# Interface: TestcaseProcessorOptions

Defined in: TestcaseProcessor.ts:33

## Properties

### generatorRegistry

> **generatorRegistry**: `DataGeneratorRegistry`

Defined in: TestcaseProcessor.ts:38

The registry containing all the data generators

***

### logger?

> `optional` **logger**: `LoggerInterface`

Defined in: TestcaseProcessor.ts:41

The logger to use

***

### tables

> **tables**: `Record`\<`string`, `TableInterface`\>

Defined in: TestcaseProcessor.ts:50

Stores all the tables by there name

***

### writeMetaData?

> `optional` **writeMetaData**: `DataWriterFunctionField`

Defined in: TestcaseProcessor.ts:44

A function to transfer the data from a Todo into the TestcaseData object

***

### writer

> **writer**: [`InterfaceWriter`](InterfaceWriter.md)[]

Defined in: TestcaseProcessor.ts:35

All the writer used to write the data of the test cases

***

### writeStaticData?

> `optional` **writeStaticData**: `DataWriterFunctionStatic`

Defined in: TestcaseProcessor.ts:47

A function to transfer the data from a Todo into the TestcaseData object
