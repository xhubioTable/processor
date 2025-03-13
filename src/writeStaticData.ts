import { NodeTodoStaticInterface } from './NodeTodoStaticInterface'
import { TestcaseDataInterface } from './TestcaseDataInterface'

/**
 * Writes static data from the provided todos into the test case data object.
 *
 * For each todo, the function extracts the instance ID, table name, and field name,
 * then stores the static value in the test case data structure under the corresponding keys.
 *
 * @param testcaseData - The object that stores all the information for this test case.
 * @param todos - An array of NodeTodoStaticInterface items representing the static data todos to be processed.
 */
export function writeStaticData(
  testcaseData: TestcaseDataInterface,
  todos: NodeTodoStaticInterface[]
) {
  for (const todo of todos) {
    // Extract key values from the todo's node.
    const instanceId = todo.node.instanceId
    const tableName = todo.node.testcaseMeta.tableName
    const fieldName = todo.fieldName

    // Initialize the nested objects in testcaseData if they don't exist.
    if (testcaseData.data[tableName] === undefined) {
      testcaseData.data[tableName] = {}
    }
    if (testcaseData.data[tableName][instanceId] === undefined) {
      testcaseData.data[tableName][instanceId] = {}
    }
    if (testcaseData.data[tableName][instanceId][fieldName] === undefined) {
      testcaseData.data[tableName][instanceId][fieldName] = []
    }

    // Write the static value from the todo into the test case data.
    const value = todo.value
    testcaseData.data[tableName][instanceId][fieldName] = value
  }
}
