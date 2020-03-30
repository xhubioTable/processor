import { v4 as uuidv4 } from 'uuid'

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
