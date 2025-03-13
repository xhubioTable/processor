[**@tlink/processor**](../README.md)

***

[@tlink/processor](../globals.md) / SimpleArrayFilterProcessor

# Class: SimpleArrayFilterProcessor

Defined in: filter/SimpleArrayFilterProcessor.ts:27

A filter processor that filters test cases based on an array of tags.

This processor splits the provided filter expression using a delimiter and
checks if any of the tokens appear in the list of tags attached to a test case.
It is typically registered by name in the processor and referenced in the decision table.

## Implements

- [`FilterProcessorInterface`](../interfaces/FilterProcessorInterface.md)

## Constructors

### new SimpleArrayFilterProcessor()

> **new SimpleArrayFilterProcessor**(`opts`): [`SimpleArrayFilterProcessor`](SimpleArrayFilterProcessor.md)

Defined in: filter/SimpleArrayFilterProcessor.ts:43

Constructs a new SimpleArrayFilterProcessor.

#### Parameters

##### opts

`SimpleArrayFilterProcessorOptions` = `{}`

Options for configuring the filter processor, including the name and delimiter.

#### Returns

[`SimpleArrayFilterProcessor`](SimpleArrayFilterProcessor.md)

## Properties

### delimiter

> **delimiter**: `string`

Defined in: filter/SimpleArrayFilterProcessor.ts:36

The delimiter used to split the filter expression.

***

### name

> **name**: `string`

Defined in: filter/SimpleArrayFilterProcessor.ts:31

The name of this filter processor.

#### Implementation of

[`FilterProcessorInterface`](../interfaces/FilterProcessorInterface.md).[`name`](../interfaces/FilterProcessorInterface.md#name)

## Methods

### filter()

> **filter**(`tags`, `expression`): `boolean`

Defined in: filter/SimpleArrayFilterProcessor.ts:59

Filters an array of tags using the provided expression.

The method evaluates the given expression against the list of tags
and returns true if the filter criteria are met.

#### Parameters

##### tags

`string`[]

An array of tags associated with a test case.

##### expression

`string`

A filter expression containing one or more tokens separated by the delimiter.

#### Returns

`boolean`

True if at least one token in the expression is found in the tags array; otherwise, false.

#### Implementation of

[`FilterProcessorInterface`](../interfaces/FilterProcessorInterface.md).[`filter`](../interfaces/FilterProcessorInterface.md#filter)
