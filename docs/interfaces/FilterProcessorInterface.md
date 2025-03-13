[**@tlink/processor**](../README.md)

***

[@tlink/processor](../globals.md) / FilterProcessorInterface

# Interface: FilterProcessorInterface

Defined in: filter/FilterProcessorInterface.ts:4

Represents a filter processor used to filter generated test cases based on tags.

## Properties

### filter()

> **filter**: (`tags`, `expression`) => `boolean`

Defined in: filter/FilterProcessorInterface.ts:20

Filters an array of tags using the provided expression.

The method evaluates the given expression against the list of tags
and returns true if the filter criteria are met.

#### Parameters

##### tags

`string`[]

An array containing all the tags associated with a test case.

##### expression

`string`

A filter expression to evaluate the tags.

#### Returns

`boolean`

True if the filter criteria are satisfied; otherwise, false.

***

### name

> **name**: `string`

Defined in: filter/FilterProcessorInterface.ts:8

The name of the filter processor.
