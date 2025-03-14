[**@xhubiotable/processor**](../README.md)

***

[@xhubiotable/processor](../globals.md) / InterfaceWriter

# Interface: InterfaceWriter

Defined in: [InterfaceWriter.ts:11](https://github.com/xhubioTable/processor/blob/dd9cd7bf88ca5f4aa82c6b7600a42543cf46c289/src/InterfaceWriter.ts#L11)

Defines the interface for a writer used by the processor to output test case data.

An InterfaceWriter is responsible for handling the output process and typically
performs three main operations: actions to execute before processing any test cases,
writing the test case data during processing, and actions to execute after processing all test cases.

## Properties

### logger

> **logger**: `LoggerInterface`

Defined in: [InterfaceWriter.ts:15](https://github.com/xhubioTable/processor/blob/dd9cd7bf88ca5f4aa82c6b7600a42543cf46c289/src/InterfaceWriter.ts#L15)

Logger instance used for logging writer operations.

## Methods

### after()

> **after**(): `Promise`\<`void`\>

Defined in: [InterfaceWriter.ts:43](https://github.com/xhubioTable/processor/blob/dd9cd7bf88ca5f4aa82c6b7600a42543cf46c289/src/InterfaceWriter.ts#L43)

Method called after the last test case has been processed.

This method allows the writer to perform any cleanup or finalization tasks.

#### Returns

`Promise`\<`void`\>

A promise that resolves when all finalization tasks are complete.

***

### before()

> **before**(): `Promise`\<`void`\>

Defined in: [InterfaceWriter.ts:24](https://github.com/xhubioTable/processor/blob/dd9cd7bf88ca5f4aa82c6b7600a42543cf46c289/src/InterfaceWriter.ts#L24)

Method called before the first test case is processed.

This method allows the writer to perform any necessary initialization or setup tasks.

#### Returns

`Promise`\<`void`\>

A promise that resolves when the initialization is complete.

***

### write()

> **write**(`testcaseData`): `Promise`\<`void`\>

Defined in: [InterfaceWriter.ts:34](https://github.com/xhubioTable/processor/blob/dd9cd7bf88ca5f4aa82c6b7600a42543cf46c289/src/InterfaceWriter.ts#L34)

Writes the test case data.

This method is called for writing or exporting the test case data contained in the TestcaseDataInterface.

#### Parameters

##### testcaseData

`TestcaseDataInterface`

The TestcaseData object containing all processed test case data.

#### Returns

`Promise`\<`void`\>

A promise that resolves when the writing operation is complete.
