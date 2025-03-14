**@xhubiotable/processor**

***

# Overview

The following diagram shows the interaction between the processor and
external components. It illustrates the order in which the processor
executes its tasks, along with the flow of data between the processor,
generators, and writers.

![processorOverview](images/processor/processorOverview.svg)

Understanding the Picture: \* The order of the arrows indicates the
sequence in which the processor executes its operations. \* The
rectangles on the left represent the internal program flow within the
processor. \* The arrows depict interactions with the external
generators and writers.

## Init

In the initialization phase, custom code sets up the processor. This
involves: \* Providing a generator registry with all required generators
registered. \* Supplying an array of writer objects that will be used to
output the test case data. \* Loading all spreadsheets and converting
them into table models.

After these steps, the processor is ready to begin processing.

## Process

When the `process()` function is invoked, the processor goes through
several steps:

### loadStore()

-   The processor iterates over all registered generators and calls
    their `loadStore()` method.

-   This allows each generator to initialize or load stored data if its
    `useStore` property is true.

### writer.before()

-   The processor loops over all writer objects and calls their
    `before()` method.

-   This step allows writers to perform any necessary setup (e.g.,
    establishing database connections).

### Loop Tables

-   The processor iterates over all provided table models.

-   Each table supplies a list of test cases that are to be executed.

### Loop Test Cases

-   For each test case provided by a table, the processor processes it
    independently.

-   The processing of a test case involves:

    -   Calling the `generate()` method of all generators defined in the
        test case to produce data.

    -   Resolving all references (internally) within the test case.

    -   Calling `createPostProcessTodos()` on each generator to prepare
        additional processing tasks.

    -   Executing all gathered postprocessing todos to finalize the data
        for the test case.

    -   Finally, calling the `write()` method on all writer objects to
        export the generated data.

### saveStore()

-   Once all test case data has been generated and written, the
    processor iterates over all generators again and calls their
    `saveStore()` method.

-   This allows generators to store or cache the generated data for
    future runs.

### writer.after()

-   In the final step, the processor calls the `after()` method on all
    writer objects.

-   This step allows writers to perform any necessary teardown or
    cleanup operations.

This comprehensive flow ensures that the processor sets up its
components, generates and processes test case data, and finally exports
the data in the required format.

## Usage

    import { Processor } from '@tlink/processor'

    const opts = {
      generatorRegistry: {}, 
      writer: [],            
      tables: {}             
    }

    const processor = new Processor(opts)
    processor.process()

-   The service registry containing all registered generators. For more
    details, refer to @tlink/data-generator.

-   An array of exporters. Each exporter receives an object of type
    'TestcaseData' for each test case.

-   The tables object as loaded by the spreadsheet importer.

# Reference

A reference points to another test case in the same table or a different
table. Each time a reference is resolved, a new instance of the
referenced test case is created. Furthermore, a reference can target a
range of test cases—in which case, for every test case in the range, the
calling test case is duplicated.

## Syntax of a Reference

The following images illustrate the syntax of a reference command:

![referencesSyntax](images/processor/referencesSyntax.svg)

![referencesRangeSyntax](images/processor/referencesRangeSyntax.svg)

A reference command generally follows this structure:

    ref:<instanceIdSuffix>:<targetTableName>:<targetFieldName>:<targetTestcaseName>

-   For a range reference, the command is enclosed in square brackets.
    In the example above, the reference points to test cases "tc2",
    "tc3", and "tc4".

## Self Reference

A self reference points to another field within the same test case. This
is common, for example, in a registration form where the "confirm
password" field must match the "password" field.

**Field password2**

    ref::Person:password:

For a self reference, both the test case name and the instanceIdSuffix
should be omitted.

You can also omit the table name:

    ref:::password:

## Range Reference

A normal reference does not affect the calling test case. However, when
a reference specifies a range, the processor creates a separate instance
of the calling test case for each test case in the range.

The following diagram illustrates how a range reference is resolved:

![rangeReferenceSolved](images/processor/rangeReferenceSolved.svg)

For example, consider test case "T1" in the table "Person" with three
references:

-   **Reference 1:** Points to the "email" field of test case "T2" in
    table "Person" with instanceId "1". The generator creates a new data
    set for "T2" under instanceId "1" and returns the value for "email".

-   **Reference 2:** Points to the same target as Reference 1 but to a
    different field ("name"). Since both references use the same
    instanceId "1", no new instance is created; both refer to the same
    data set.

-   **Reference 3:** Points to table "Range2" with a target test case
    range "T3-4". This means that the processor must create two
    instances of test case "T1" (e.g., labeled "a" and "a'") to resolve
    the reference. For range references, the instanceIdSuffix must be
    omitted.

## Default Values in References

-   **Table Name:** If omitted, the processor assumes the reference
    belongs to the current table.

-   **InstanceId:** If not provided, each reference creates a new
    instance of the target test case.

-   **Field Name:** If omitted, no data is included from the referenced
    field.

-   **Test Case Name:** This value is mandatory.

# Generator Command

The generator command in a decision table specifies how to generate data
for a field. It allows users to instruct a data generator to produce a
set of data that can be reused across multiple fields if needed. This
mechanism is especially useful when a generator must provide consistent
data (e.g., a person’s name, email, etc.) for different columns or rows
within the same test case.

![example from a decision table:](images/processor/generator.png)

## Generator Command Format

The generator command follows the format:

    gen:<instanceId>:<generatorName>:<parameter>

-   **instanceId** An internal identifier for the generated data
    instance. If no instanceId is provided, the generator will
    automatically generate a UUID. By specifying an instanceId, the same
    data set can be retrieved across different fields, ensuring
    consistency.

-   **generatorName** The name of the data generator to invoke. This
    name must match a registered generator in the system.

-   **parameter** Additional parameters that dictate which piece of data
    to return from the generator. This allows the same generator to
    produce multiple related values (e.g., firstName, lastName, email).

For example, consider a generator called "AdressDataGenerator" that
creates personal data. Instead of generating new data for every field,
you can reuse the same data set by providing the same instanceId:

    gen:1:AdressDataGenerator:firstName  
    gen:1:AdressDataGenerator:lastName   
    gen:1:AdressDataGenerator:email      

-   The first call (with instanceId "1") creates a new data set and
    returns the value for "firstName".

-   The second call (using the same instanceId "1") retrieves the
    existing data set and returns "lastName".

-   Similarly, the third call retrieves the "email" value from the same
    data set.

The use of the instanceId parameter is crucial; it ensures that multiple
calls to the same generator yield consistent results when required.

# Static Data

Static data is the simplest kind of data. All entries not starting with
'gen:' or 'ref:' is interpreted as static data. This data is just copied
to the 'testcaseData' object as it is.

# Writer Interface

The Writer is responsible for exporting the generated test case data in
the required format. It is best practice to implement one writer per
target format or data type.

## Constructor

The constructor initializes the writer and sets up the logger. The
logger is used for writing logs throughout the writer’s lifecycle.

    constructor(opts = {}) {
      this.logger = opts.logger || getLoggerMemory()
    }

**Example:** You can log information within the writer using:

    this.logger.info('My important info')

## before

The `before()` method is called once when the processor starts
processing test cases. It is intended for any necessary setup or
initialization (e.g., opening a file, establishing a connection, etc.).

    async before() {
      console.log(`Start a new processing`)
    }

## after

The `after()` method is invoked after all test cases have been
processed. It is meant for any necessary teardown or cleanup tasks
(e.g., closing connections, writing final summary, etc.).

    async after() {
      console.log(`End processing`)
    }

## write

The `write()` method is the core of the Writer interface. It is called
once for each test case and receives a test case data object containing
all generated data for that test case. It is the writer’s responsibility
to extract and export the data in the desired format.

    async write(testcaseData) {
      console.log(
        `Write testcase '${testcaseData.name}' for table '${testcaseData.tableName}'`
      )
    }
