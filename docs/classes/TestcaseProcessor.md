[**@xhubiotable/processor**](../README.md)

***

[@xhubiotable/processor](../globals.md) / TestcaseProcessor

# Class: TestcaseProcessor

Defined in: [TestcaseProcessor.ts:53](https://github.com/xhubioTable/processor/blob/dd9cd7bf88ca5f4aa82c6b7600a42543cf46c289/src/TestcaseProcessor.ts#L53)

## Implements

- `InterfaceProcessor`

## Constructors

### new TestcaseProcessor()

> **new TestcaseProcessor**(`opts`): [`TestcaseProcessor`](TestcaseProcessor.md)

Defined in: [TestcaseProcessor.ts:74](https://github.com/xhubioTable/processor/blob/dd9cd7bf88ca5f4aa82c6b7600a42543cf46c289/src/TestcaseProcessor.ts#L74)

#### Parameters

##### opts

[`TestcaseProcessorOptions`](../interfaces/TestcaseProcessorOptions.md)

#### Returns

[`TestcaseProcessor`](TestcaseProcessor.md)

## Properties

### filterProcessor

> **filterProcessor**: `Map`\<`string`, [`FilterProcessorInterface`](../interfaces/FilterProcessorInterface.md)\>

Defined in: [TestcaseProcessor.ts:63](https://github.com/xhubioTable/processor/blob/dd9cd7bf88ca5f4aa82c6b7600a42543cf46c289/src/TestcaseProcessor.ts#L63)

Stores all the filter processors by there name

***

### generatorRegistry

> **generatorRegistry**: `DataGeneratorRegistry`

Defined in: [TestcaseProcessor.ts:66](https://github.com/xhubioTable/processor/blob/dd9cd7bf88ca5f4aa82c6b7600a42543cf46c289/src/TestcaseProcessor.ts#L66)

The registry containing all the data generators

***

### logger

> **logger**: `LoggerInterface`

Defined in: [TestcaseProcessor.ts:60](https://github.com/xhubioTable/processor/blob/dd9cd7bf88ca5f4aa82c6b7600a42543cf46c289/src/TestcaseProcessor.ts#L60)

***

### tables

> **tables**: `Record`\<`string`, `TableInterface`\> = `{}`

Defined in: [TestcaseProcessor.ts:69](https://github.com/xhubioTable/processor/blob/dd9cd7bf88ca5f4aa82c6b7600a42543cf46c289/src/TestcaseProcessor.ts#L69)

Stores all the tables by there name

***

### writeMetaData

> **writeMetaData**: `DataWriterFunctionField` = `writeFieldData`

Defined in: [TestcaseProcessor.ts:55](https://github.com/xhubioTable/processor/blob/dd9cd7bf88ca5f4aa82c6b7600a42543cf46c289/src/TestcaseProcessor.ts#L55)

A function to transfer the data from a Todo into the TestcaseData object

***

### writer

> **writer**: [`InterfaceWriter`](../interfaces/InterfaceWriter.md)[]

Defined in: [TestcaseProcessor.ts:72](https://github.com/xhubioTable/processor/blob/dd9cd7bf88ca5f4aa82c6b7600a42543cf46c289/src/TestcaseProcessor.ts#L72)

All the writer used to write the data of the test cases

***

### writeStaticData

> **writeStaticData**: `DataWriterFunctionStatic`

Defined in: [TestcaseProcessor.ts:58](https://github.com/xhubioTable/processor/blob/dd9cd7bf88ca5f4aa82c6b7600a42543cf46c289/src/TestcaseProcessor.ts#L58)

A function to transfer the data from a Todo into the TestcaseData object

## Methods

### addFilterProcessor()

> **addFilterProcessor**(`filterProcessor`): `void`

Defined in: [TestcaseProcessor.ts:123](https://github.com/xhubioTable/processor/blob/dd9cd7bf88ca5f4aa82c6b7600a42543cf46c289/src/TestcaseProcessor.ts#L123)

Adds a new filterProcessor to the processor

#### Parameters

##### filterProcessor

[`FilterProcessorInterface`](../interfaces/FilterProcessorInterface.md)

A filterProcessor object

#### Returns

`void`

***

### addTables()

> **addTables**(`tables`): `void`

Defined in: [TestcaseProcessor.ts:91](https://github.com/xhubioTable/processor/blob/dd9cd7bf88ca5f4aa82c6b7600a42543cf46c289/src/TestcaseProcessor.ts#L91)

Adds all the given tables to the processor.

#### Parameters

##### tables

A list of tables

`TableInterface` | `TableInterface`[]

#### Returns

`void`

#### Implementation of

`InterfaceProcessor.addTables`

***

### clear()

> **clear**(): `void`

Defined in: [TestcaseProcessor.ts:115](https://github.com/xhubioTable/processor/blob/dd9cd7bf88ca5f4aa82c6b7600a42543cf46c289/src/TestcaseProcessor.ts#L115)

Deletes the loaded tables
and also the data of the generators

#### Returns

`void`

#### Implementation of

`InterfaceProcessor.clear`

***

### createNodeTree()

> **createNodeTree**(`testcaseDefinition`): `Promise`\<`NodeInterface`[]\>

Defined in: [TestcaseProcessor.ts:703](https://github.com/xhubioTable/processor/blob/dd9cd7bf88ca5f4aa82c6b7600a42543cf46c289/src/TestcaseProcessor.ts#L703)

This method creates the node trees for one testcaseDefinition

#### Parameters

##### testcaseDefinition

`TestcaseDefinitionInterface`

The Testcase definition to be executed

#### Returns

`Promise`\<`NodeInterface`[]\>

The new nodes created

***

### getFilterProcessor()

> **getFilterProcessor**(`name`): `undefined` \| [`FilterProcessorInterface`](../interfaces/FilterProcessorInterface.md)

Defined in: [TestcaseProcessor.ts:138](https://github.com/xhubioTable/processor/blob/dd9cd7bf88ca5f4aa82c6b7600a42543cf46c289/src/TestcaseProcessor.ts#L138)

Returns a filterProcessor with the given name

#### Parameters

##### name

`string`

The name of this filterProcessor

#### Returns

`undefined` \| [`FilterProcessorInterface`](../interfaces/FilterProcessorInterface.md)

The filterProcessor with the given name or undefined if the processor does not exists

***

### postProcessGenerators()

> **postProcessGenerators**(`testcaseData`): `Promise`\<`void`\>

Defined in: [TestcaseProcessor.ts:262](https://github.com/xhubioTable/processor/blob/dd9cd7bf88ca5f4aa82c6b7600a42543cf46c289/src/TestcaseProcessor.ts#L262)

Calls the generator for post processing

#### Parameters

##### testcaseData

`TestcaseDataInterface`

The testcaseData object wich stores all the information of this testcase

#### Returns

`Promise`\<`void`\>

True if the todo is fullfilled

***

### process()

> **process**(): `Promise`\<`void`\>

Defined in: [TestcaseProcessor.ts:147](https://github.com/xhubioTable/processor/blob/dd9cd7bf88ca5f4aa82c6b7600a42543cf46c289/src/TestcaseProcessor.ts#L147)

Processes all the tables currently loaded in the processor.

This method is asynchronous and returns a promise that resolves once all tables
have been processed. Derived classes must implement the actual processing logic.

#### Returns

`Promise`\<`void`\>

A promise that resolves when processing is complete.

#### Implementation of

`InterfaceProcessor.process`

***

### processTable()

> **processTable**(`table`): `Promise`\<`void`\>

Defined in: [TestcaseProcessor.ts:193](https://github.com/xhubioTable/processor/blob/dd9cd7bf88ca5f4aa82c6b7600a42543cf46c289/src/TestcaseProcessor.ts#L193)

Processes a single table

#### Parameters

##### table

`TableInterface`

The table object to be executed

#### Returns

`Promise`\<`void`\>

***

### processTestcase()

> **processTestcase**(`testcaseDefinition`): `Promise`\<`TestcaseData`[]\>

Defined in: [TestcaseProcessor.ts:300](https://github.com/xhubioTable/processor/blob/dd9cd7bf88ca5f4aa82c6b7600a42543cf46c289/src/TestcaseProcessor.ts#L300)

Processes a single testcase of a table. This method is called
from the TableProcessor. This is the entry point for a single testcase.

#### Parameters

##### testcaseDefinition

`TestcaseDefinitionInterface`

The Testcase definition to be executed

#### Returns

`Promise`\<`TestcaseData`[]\>

An array TestcaseData Objects
