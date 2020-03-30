import { v4 as uuidv4 } from 'uuid'
import clone from 'clone'

/**
 * When traversing the tables we first build a graph
 * representing the data generation order.
 * The graph is build out of this nodes
 */
export default class Node {
  constructor(opts = {}) {
    // The instance id of this node
    this.instanceId = uuidv4()

    // The name of the table this node was created for
    this.tableName = opts.tableName

    // The type of this table
    this.tableType = opts.tableType

    // The name of this testcase
    this.testcaseName = opts.testcaseName

    // If the node is created by a reference we need to store the instanceId suffix
    // of this reference
    this.refInstanceId = undefined
    // ---------------------------------
    // other data
    // ---------------------------------

    // stores the referenced nodes
    // references.<table name>.<testcase name>.<instanceId> = node
    // So the refernces can just get the node they need
    this.references = {}

    // ---------------------------------
    // raw data
    // ---------------------------------

    // stores all the todos by there type
    this.todos = opts.todos || {
      generator: [],
      static: [],
      reference: [],
      meta: [],
    }

    // ---------------------------------
    // reference cache
    // ---------------------------------
    this.refCache = {}

    this.instanceIdCache = {}

    this.meta = opts.meta

    this.neverExecute =
      opts.neverExecute !== undefined ? opts.neverExecute : false

    // saves all the active tags. These Tags are used for filtering
    this.tags = opts.tags || []
  }

  /**
   * returns an array with all the todos.
   * It will crawl all the referenced nodes and adds
   * the todos of them
   * @return todos {array} An array of todos
   */
  get todosGenerator() {
    this._buildTodos()
    return this.tmpTodos.generator
  }

  get todosReference() {
    this._buildTodos()
    return this.tmpTodos.reference
  }

  get todosStatic() {
    this._buildTodos()
    return this.tmpTodos.static
  }

  get todosMeta() {
    this._buildTodos()
    return this.tmpTodos.meta
  }

  /**
   * Build a local variable with all the todos
   */
  _buildTodos() {
    if (this.tmpTodos === undefined) {
      this.tmpTodos = {
        generator: [],
        static: [],
        reference: [],
        meta: [],
      }

      for (const todo of this.todos.generator) {
        todo.node = this
        this.tmpTodos.generator.push(todo)
      }
      for (const todo of this.todos.static) {
        todo.node = this
        this.tmpTodos.static.push(todo)
      }
      for (const todo of this.todos.meta) {
        todo.node = this
        this.tmpTodos.meta.push(todo)
      }

      for (const fieldName of Object.keys(this.references)) {
        const ref = this.references[fieldName]
        this.tmpTodos.reference.push(ref)
        if (!ref.selfReference) {
          const target = ref.target
          for (const todo of target.todosReference) {
            this.tmpTodos.reference.push(todo)
          }
          for (const todo of target.todosGenerator) {
            todo.node = target
            this.tmpTodos.generator.push(todo)
          }
          for (const todo of target.todosStatic) {
            todo.node = target
            this.tmpTodos.static.push(todo)
          }
          for (const todo of target.todosMeta) {
            todo.node = target
            this.tmpTodos.meta.push(todo)
          }
        }
      }
    }
  }

  /**
   * Creates the instanceId for a reference.
   * The instanceId is unique for each target object.
   * If two reference points to the same intance of a target
   * the same instanceId is used.
   * If no suffix is given
   * @param referenceCmd {object} The reference command
   * @return instanceId {string} The reference instance id
   */
  createReferenceInstanceId(referenceCmd) {
    if (this.isSelfReference(referenceCmd)) {
      return this.instanceId
    }

    const idSuffix = referenceCmd.instanceIdSuffix

    if (idSuffix !== undefined && idSuffix !== '') {
      if (this.instanceIdCache[idSuffix] === undefined) {
        // for this suffix no instanceId is registered
        this.instanceIdCache[idSuffix] = uuidv4()
      }
      return this.instanceIdCache[idSuffix]
    }

    // no suffix means always new instance
    return uuidv4()
  }

  /**
   * Checks if the given reference is a self reference.
   *
   * Rules:
   * No instanceIdSuffix
   * The test case name is same as node test case name
   * The TableName is same as node table name
   *
   * @param referenceCmd {object} The reference command
   * @return status {boolean} True, if the reference is a self reference
   */
  isSelfReference(referenceCmd) {
    if (
      (referenceCmd.targetTestcaseName === undefined ||
        referenceCmd.targetTestcaseName === '' ||
        referenceCmd.targetTestcaseName === this.testcaseName) &&
      referenceCmd.targetTableName === this.tableName &&
      (referenceCmd.instanceIdSuffix === undefined ||
        referenceCmd.instanceIdSuffix === '')
    ) {
      // in this case it is a self reference
      return true
    }
    return false
  }

  addReference(reference) {
    // The field name the reference is defined in
    const fieldName = reference.fieldName
    this.references[fieldName] = reference
    reference.parent = this

    if (reference.selfReference) {
      reference.target = this
    } else if (this.refCache[reference.instanceId] === undefined) {
      this.refCache[reference.instanceId] = reference
    } else {
      // This reference point to a node which an other reference already points to
      const otherRef = this.refCache[reference.instanceId]
      reference.target = otherRef.target
    }
  }

  /**
   * Clones the node
   */
  clone(recursive = false) {
    const newNode = new Node({
      tableName: this.tableName,
      tableType: this.tableType,
      testcaseName: this.testcaseName,
      neverExecute: this.neverExecute,
      tags: this.tags,
      todos: clone(this.todos),
    })

    // The reference commands are not cloned
    newNode.todos.reference = []

    if (recursive) {
      for (const fieldName of Object.keys(this.references)) {
        const ref = this.references[fieldName]
        let newRef
        if (ref.selfReference) {
          // A self reference must not be cloned recursive
          newRef = ref.clone(false)
        } else {
          newRef = ref.clone(true)
        }
        newNode.addReference(newRef)
      }
    }

    return newNode
  }

  /**
   * Clones a node for this parent. If this node where already cloned,
   * the previous clone will be returned.
   * @param nodeToClone {object} The node to be cloned
   * @return clone {object} The clone of the node
   */
  getCloneFor(nodeToClone) {
    const origInstanceId = nodeToClone.instanceId
    let clonedNode
    if (this.cloneRef[origInstanceId] === undefined) {
      clonedNode = nodeToClone.clone()
      this.cloneRef[origInstanceId] = clonedNode
    } else {
      clonedNode = this.cloneRef[origInstanceId]
    }
    return clonedNode
  }
}
