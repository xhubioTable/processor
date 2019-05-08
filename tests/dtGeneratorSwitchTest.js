import { executeTest } from './decisionTestcaseProcessor'

/**
 * test for the TestcaseProcessorDecision
 */

// eslint-disable-next-line no-unused-vars
const expected = {
  Person_with_friend: {
    '1-1': {
      'last-name': '<empty>',
    },
    '1-2': {
      'first-name': '<myFirstName>',
      'last-name': '<empty>',
      email: '<myEmail>',
    },
    '1-3': {
      'first-name': '<myFirstName>',
      'last-name': '<myLastName>',
    },
    '1-4': {
      'first-name': '<myFirstName>',
      'last-name': '<myLastName>',
      email: '<myEmail>',
    },
    '2-1': {
      'first-name': '<EMPTY>',
      'last-name': '<empty>',
      email: '<EMPTY>',
    },
    '2-2': {
      'first-name': '<myFirstName>',
      'last-name': '<empty>',
      email: '<myEmail>',
    },
    '2-3': {
      'first-name': '<myFirstName>',
      email: '<EMPTY>',
    },
    '2-4': {
      'first-name': '<myFirstName>',
      email: '<myEmail>',
    },
    '3-1': {
      'first-name': '<EMPTY>',
      'last-name': '<empty>',
      email: '<EMPTY>',
    },
    '3-2': {
      'first-name': '<myFirstName>',
      'last-name': '<empty>',
    },
    '3-3': {
      'first-name': '<myFirstName>',
      'last-name': '<myLastName>',
      email: '<EMPTY>',
    },
    '3-4': {
      'first-name': '<myFirstName>',
      'last-name': '<myLastName>',
    },
    '4-1': {
      'first-name': '<EMPTY>',
      'last-name': '<empty>',
      email: '<EMPTY>',
    },
    '4-2': {
      'first-name': '<myFirstName>',
      'last-name': '<empty>',
      email: '<myEmail>',
    },
    '4-3': {
      'first-name': '<myFirstName>',
      'last-name': '<myLastName>',
      email: '<EMPTY>',
    },
    '4-4': {
      'first-name': '<myFirstName>',
      'last-name': '<myLastName>',
      email: '<myEmail>',
    },
  },
}

export default class Validator {
  constructor(opts = {}) {
    // The expected data
    this.expected = opts.expected
  }

  /**
   * Calls the expect method
   */
  validate(actual) {
    // const dat = actual.data[actual.instanceId]
    const expTableNames = Object.keys(this.expected)

    for (const expTableName of expTableNames) {
      const expTableData = this.expected[expTableName]
      // Check that the expected table exists
      expect(actual[expTableName]).toBeDefined()

      const expTestcaseNames = Object.keys(expTableData)

      // check that the table result exists
      for (const expTestcaseName of expTestcaseNames) {
        // Check that the expected test case exists
        expect(actual[expTableName][expTestcaseName]).toBeDefined()

        const exp = expTableData[expTestcaseName]
        const dat = actual[expTableName][expTestcaseName]
        const instId = Object.keys(dat.data['Person'])[0]
        const act = dat.data['Person'][instId]

        exp.tcName = expTestcaseName
        act.tcName = expTestcaseName

        expect(act).toEqual(exp)
      }

      // Check for each table that the count of test cases matches
      expect(expTestcaseNames.length).toBe(
        Object.keys(actual[expTableName]).length
      )
    }

    // check the count of actual test cases compared to the expected count
    expect(expTableNames.length).toBe(Object.keys(actual).length)
  }
}

// eslint-disable-next-line no-unused-vars
const testDefinition = {
  excelFileName: 'dt_generator_switch.xls',
  excelTableNames: ['Person', 'Person_with_friend'],
  validator: new Validator({ expected }),
  tableName: 'Person_with_friend',
}

executeTest(testDefinition)
