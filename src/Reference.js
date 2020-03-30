import { v4 as uuidv4 } from 'uuid'

/**
 * When traversing the tables we first build a graph
 * representing the data generation order.
 * The graph is build out of this nodes
 */

export default class Reference {
  constructor(opts = {}) {
    this.id = uuidv4()

    this.instanceId = opts.instanceId

    this.selfReference = false
    if (opts.selfReference !== undefined) {
      this.selfReference = opts.selfReference
    }

    // If the reference points to the same target as an other reference
    this.isSameRef = false

    // all the available tables
    this.tables = opts.tables

    // The registry for all the processors
    this.processorRegistry = opts.processorRegistry

    // The parent node
    this.parent = opts.parent

    // The target node
    this.target = undefined

    // The instance id of this reference
    this.instanceIdSuffix = opts.instanceIdSuffix

    // The name of the table this node was created for
    this.tableName = opts.tableName

    // The name of the target table
    this.targetTableName = opts.targetTableName

    // The type of this table
    this.tableType = opts.tableType

    // The type of the target table
    this.targetTableType = opts.targetTableType

    // The name of this testcase
    this.testcaseName = opts.testcaseName

    // The name of the target testcase
    this.targetTestcaseName = opts.targetTestcaseName

    // the fieldName the reference is defined in
    this.fieldName = opts.fieldName

    // the fieldName the reference points to
    this.targetFieldName = opts.targetFieldName

    this.meta = opts.meta
  }

  /**
   * The target identity is used to identify if a reference points to
   * the same target in the same instance
   */
  get targetIdentity() {
    const suffix = this.instanceIdSuffix || '__DEFAULT__'
    return `${this.targetTableName}-${this.targetTestcaseName}-${suffix}`
  }

  /**
   * Clones the current reference
   * @param recursiv {boolean} if true, then also the target node will be cloned recursivly
   */
  clone(recursiv = false) {
    const newRef = new Reference({
      ...this,
      parent: undefined,
      target: undefined,
      isSameRef: false,
    })

    if (recursiv) {
      const newTarget = this.target.clone(recursiv)
      newRef.target = newTarget
    }

    return newRef
  }
}
