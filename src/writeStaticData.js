/**
 * This methode writes the static data from the todos into the test case data Object
 * @param testcaseData {object} The testcaseData object wich stores all the information of this testcase
 * @param todos {object} The todos to be executed
 */
export function writeStaticData(testcaseData, todos) {
  for (const todo of todos) {
    const instanceId = todo.node.instanceId
    const tableName = todo.node.tableName
    const fieldName = todo.fieldName

    if (testcaseData.data[tableName] === undefined) {
      testcaseData.data[tableName] = {}
    }
    if (testcaseData.data[tableName][instanceId] === undefined) {
      testcaseData.data[tableName][instanceId] = {}
    }
    if (testcaseData.data[tableName][instanceId][fieldName] === undefined) {
      testcaseData.data[tableName][instanceId][fieldName] = []
    }

    const value = todo.value
    testcaseData.data[tableName][instanceId][fieldName] = value
  }
}
