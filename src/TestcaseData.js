'use strict'

import uuidv4 from 'uuid/v4'

export default class TestcaseData {
  constructor(opts = {}) {
    // each table this testcase gets data from will be pushed to this array.
    // The table which creates the testcase has position '0'
    this.tableName = opts.tableName

    // The name of the testcase will be created in the table which
    // issues the testcase.
    this.name = opts.name

    // The data of this testcase. Each table which will add data to the testcase will store
    // the data unter the table name:
    // this.data->tableName = data
    this.data = {}

    // The main instance id of this tescase data
    this.instanceId = opts.instanceId || uuidv4()

    // The callTree shows the way the tes data was build
    this.callTree = opts.callTree

    /*
     * Stores the generator todo for postprocessing.
     * After all the the data for an testcase was generated the generator
     * will be called a second time.
     */
    this.postProcessTodos = []
  }
}

// // The generated data will be stored under the testcase instance id
// // This example comes from a decision-table
// const dataDecision1 = {
//   'jsbbs628etghswhs82': {                 // Testcase instance id
//     person: {                             // Table name
//       name: {                             // field name
//         val:'Torsten',                    // The generated value
//         comment: 'any data',              // The data from the comment column
//         equivalenceClass: '<class name>'
//       },
//       email: {                            // field name
//         val:'foo.bar@gum.de',             // The generated value
//         comment: 'any data',              // The data from the comment column
//         equivalenceClass: '<class name>'
//       },
//     },
//     address:{
//       street: {                           // field name
//         val: 'Midway 5',                  // The generated value
//         comment: 'any data',              // The data from the comment column
//         equivalenceClass: '<class name>'
//       },
//       zip: {                              // field name
//         val: 35257,                       // The generated value
//         comment: 'any data',              // The data from the comment column
//         equivalenceClass: '<class name>'
//       },
//       city: {                             // field name
//         val: 'Hometown',                  // The generated value
//         comment: 'any data',              // The data from the comment column
//         equivalenceClass: '<class name>'
//       },
//     }
//     __meta__: {
//         effect: {                         // section name (for multi row section)
//           'Abort Action' : {              // The value from the key column
//             other: <some data>,
//             comment: <some data>
//           }
//         }
//     }
//   },
//   // This data was created for a different ID. This happens when a table reference it self
//   // or an other table multiple times. In this example the table 'person' was referenced
//   // two times.
//   'jsbbs628etghswhs82:1': {
//     person: {
//       name: {                             // field name
//         val: 'Frank',                     // The generated value
//         comment: 'any data',              // The data from the comment column
//         equivalenceClass: '<class name>'
//       },
//       email: {                            // field name
//         val: 'foo.bar@gum.de',            // The generated value
//         comment: 'any data',              // The data from the comment column
//         equivalenceClass: '<class name>'
//       },
//       __meta__: {
//           effect: {                         // section name (for multi row section)
//             'Abort Action' : {              // The value from the key column
//               other: <some data>,
//               comment: <some data>
//             }
//           }
//       }
//     }
//   }
// }
//
// // An example for a result by a matrix table. This table used the data created in the example before
// const dataMatrix1 = {
//   'jsbbs628etghswhs82': {             // Testcase instance id
//     person: {...},
//     address:{...}
//     'Action on Person' : {                // Name of the row
//       'Add email': {                      // Name of the column
//           ????
//       }
//       __meta__:{}
//     },
//   },
//   'jsbbs628etghswhs82:1': {...}
// }
