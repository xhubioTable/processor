[**@xhubiotable/processor**](../README.md)

***

[@xhubiotable/processor](../globals.md) / SimpleArrayIgnoreFilterProcessor

# Class: SimpleArrayIgnoreFilterProcessor

Defined in: [filter/SimpleArrayIgnoreFilterProcessor.ts:29](https://github.com/xhubioTable/processor/blob/dd9cd7bf88ca5f4aa82c6b7600a42543cf46c289/src/filter/SimpleArrayIgnoreFilterProcessor.ts#L29)

A filter processor that excludes test cases based on a filter expression.

This processor is used to filter out test cases in a decision table.
It is registered by name with the processor, and the decision table references
the filter by that name. When the filter is applied, the expression is split using
the specified delimiter. If any token is found in the test case's tags, the test case
is filtered out (i.e., the filter returns false). Otherwise, it returns true.

## Implements

- [`FilterProcessorInterface`](../interfaces/FilterProcessorInterface.md)

## Constructors

### new SimpleArrayIgnoreFilterProcessor()

> **new SimpleArrayIgnoreFilterProcessor**(`opts`): [`SimpleArrayIgnoreFilterProcessor`](SimpleArrayIgnoreFilterProcessor.md)

Defined in: [filter/SimpleArrayIgnoreFilterProcessor.ts:47](https://github.com/xhubioTable/processor/blob/dd9cd7bf88ca5f4aa82c6b7600a42543cf46c289/src/filter/SimpleArrayIgnoreFilterProcessor.ts#L47)

Constructs a new SimpleArrayIgnoreFilterProcessor.

#### Parameters

##### opts

`SimpleArrayIgnoreFilterProcessorOptions` = `{}`

Options for configuring the filter processor, including the name and delimiter.

#### Returns

[`SimpleArrayIgnoreFilterProcessor`](SimpleArrayIgnoreFilterProcessor.md)

## Properties

### delimiter

> **delimiter**: `string`

Defined in: [filter/SimpleArrayIgnoreFilterProcessor.ts:40](https://github.com/xhubioTable/processor/blob/dd9cd7bf88ca5f4aa82c6b7600a42543cf46c289/src/filter/SimpleArrayIgnoreFilterProcessor.ts#L40)

The delimiter used to split the filter expression.

***

### name

> **name**: `string`

Defined in: [filter/SimpleArrayIgnoreFilterProcessor.ts:35](https://github.com/xhubioTable/processor/blob/dd9cd7bf88ca5f4aa82c6b7600a42543cf46c289/src/filter/SimpleArrayIgnoreFilterProcessor.ts#L35)

The name of this filter processor.

#### Implementation of

[`FilterProcessorInterface`](../interfaces/FilterProcessorInterface.md).[`name`](../interfaces/FilterProcessorInterface.md#name)

## Methods

### filter()

> **filter**(`tags`, `expression`): `boolean`

Defined in: [filter/SimpleArrayIgnoreFilterProcessor.ts:64](https://github.com/xhubioTable/processor/blob/dd9cd7bf88ca5f4aa82c6b7600a42543cf46c289/src/filter/SimpleArrayIgnoreFilterProcessor.ts#L64)

Filters an array of tags using the provided expression.

The method evaluates the given expression against the list of tags
and returns true if the filter criteria are met.

#### Parameters

##### tags

`string`[]

An array of tags associated with the test case.

##### expression

`string`

The filter expression containing tokens to ignore.

#### Returns

`boolean`

True if none of the tokens are present in the tags; otherwise, false.

#### Implementation of

[`FilterProcessorInterface`](../interfaces/FilterProcessorInterface.md).[`filter`](../interfaces/FilterProcessorInterface.md#filter)
