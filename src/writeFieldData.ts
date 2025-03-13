import { NodeTodoFieldInterface } from './NodeTodoFieldInterface'
import { TestcaseDataInterface } from './TestcaseDataInterface'

/**
 * Writes meta data from field todos into the test case data object.
 *
 * For each todo in the provided array, this function extracts the instance ID, table name,
 * and field name from the todo's node, then appends an object containing the key, comment,
 * and other information to the corresponding field in the test case data structure.
 *
 * @param testcaseData - The object that stores all information for the current test case.
 * @param todos - An array of NodeTodoFieldInterface items representing the field todos to process.
 */
export function writeFieldData(
  testcaseData: TestcaseDataInterface,
  todos: NodeTodoFieldInterface[]
) {
  for (const todo of todos) {
    const instanceId = todo.node.instanceId
    const tableName = todo.node.testcaseMeta.tableName
    const fieldName = todo.fieldName

    // Initialize the nested objects in the test case data if they do not exist.
    if (testcaseData.data[tableName] === undefined) {
      testcaseData.data[tableName] = {}
    }
    if (testcaseData.data[tableName][instanceId] === undefined) {
      testcaseData.data[tableName][instanceId] = {}
    }
    if (testcaseData.data[tableName][instanceId][fieldName] === undefined) {
      testcaseData.data[tableName][instanceId][fieldName] = []
    }

    // Append the field data to the test case data.
    testcaseData.data[tableName][instanceId][fieldName].push({
      key: todo.key,
      comment: todo.comment,
      other: todo.other
    })
  }
}
