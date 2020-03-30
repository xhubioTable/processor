import { v4 as uuidv4 } from 'uuid'

import Node from './Node'
import TestcaseData from './TestcaseData'
import InterfaceProcessor from './InterfaceProcessor'
import Reference from './Reference'
import { cartesianProduct } from './utilCartesian'
import { writeMetaData } from './writeMetaData'
import { writeStaticData } from './writeStaticData'

export default class TestcaseProcessor extends InterfaceProcessor {
  constructor(opts = {}) {
    super(opts)

    this.writeMetaData = opts.writeMetaData || writeMetaData
    this.writeStaticData = opts.writeStaticData || writeStaticData

    // Stores all the filter processors by there name
    this.filterProcessor = new Map()
  }

  /**
   * Adds a new filterProcessor to the processor
   * @param filterProcessor {object} A filterProcessor object
   */
  addFilterProcessor(filterProcessor) {
    const name = filterProcessor.name
    if (this.filterProcessor.has(name)) {
      this.logger.error(
        `There is already a filterProcessor registered with the name '${name}'`
      )
    }
    this.filterProcessor.set(name, filterProcessor)
  }

  /**
   * Returns a filterProcessor with the given name
   * @param name {string} The name of this filterProcessor
   * @return filterProcessor {object} The filterProcessor with the given name
   */
  getFilterProcessor(name) {
    if (!this.filterProcessor.has(name)) {
      this.logger.error(
        `A filterProcessor with the name '${name}' does not exists. Filter is ignored`
      )
    }

    return this.filterProcessor.get(name)
  }

  /**
   * validate the loaded tables.
   * @return errors {array} An array with all the found errors
   * @deprecated no longer used
   */
  validate() {
    // @TODO check if this method could be removed
    return []
  }

  async process() {
    if (this.generatorRegistry.loadStore !== undefined) {
      await this.generatorRegistry.loadStore()
    }

    for (const writer of this.writer) {
      await writer.before()
    }

    try {
      // just iterate all the tables
      for (const tableName of Object.keys(this.tables)) {
        await this.logger.info(`Work on table '${tableName}'`)
        const table = this.tables[tableName]
        table.logger = this.logger

        await this.processTable(table)
      }
      // TODO Für alle generatoren die die Daten speichern
    } catch (err) {
      await this.logger.error({
        message: err.message,
        function: 'process',
        stack: err.stack,
      })
    }

    for (const writer of this.writer) {
      await writer.after()
    }

    if (this.generatorRegistry.loadStore !== undefined) {
      await this.generatorRegistry.saveStore()
    }
  }

  /**
   * Processes a single table
   * @param table {object} The table object to be executed
   */
  async processTable(table) {
    const gen = table.getTestcasesForExecution()
    try {
      let obj = gen.next()
      do {
        if (obj.value !== undefined) {
          const testcaseDefinition = obj.value
          testcaseDefinition.logger = this.logger

          await this.logger.info(
            `\tWork on test case '${testcaseDefinition.name}'`
          )
          try {
            const testcaseDataList = await this.processTestcase(
              testcaseDefinition
            )
            await this.logger.info(
              `\t\tTest case count '${testcaseDataList.length}'`
            )

            for (const tcData of testcaseDataList) {
              await this.postProcessGenerators(tcData)
              delete tcData.postProcessTodos

              for (const writer of this.writer) {
                await writer.write(tcData)
              }
            }
          } catch (err) {
            await this.logger.error({
              message: err.message,
              function: 'processTable',
              stack: err.stack,
              tableName: table.name,
              testName: testcaseDefinition.name,
            })
          }
        }
        obj = gen.next()
      } while (!obj.done)
    } catch (err) {
      await this.logger.error({
        message: err.message,
        function: 'processTable',
        stack: err.stack,
        tableName: table.name,
      })
    }
  }

  /**
   * Calls the generator for post processing
   * @param testcaseData {object} The testcaseData object wich stores all the information of this testcase
   * @return success {boolean} True if the todo is fullfilled
   */
  async postProcessGenerators(testcaseData) {
    const todos = testcaseData.postProcessTodos

    // First the todos need to be ordered
    for (const todo of todos) {
      if (todo.order === undefined) {
        todo.order = 1000
      }
    }

    todos.sort((a, b) => {
      return a.order - b.order
    })

    // Now execute the todos in there order
    for (const todo of todos) {
      const instanceId = todo.instanceIdSuffix
        ? testcaseData.instanceId + ':' + todo.instanceIdSuffix
        : testcaseData.instanceId

      const generator = this.generatorRegistry.getGenerator(todo.generatorName)

      await generator.postProcess(instanceId, testcaseData, todo, todo.config)
    }

    delete testcaseData.postProcessTodos
  }

  /**
   * Processes a single testcase of a table. This method is called
   * from the TableProcessor. This is the entry point for a single testcase.
   * @param testcaseDefinition {object} The Testcase definition to be executed
   * @return testcaseDataList {array} An array TestcaseData Objects
   */
  async processTestcase(testcaseDefinition) {
    const rootNodeList = await this.createNodeTree(testcaseDefinition)
    const tcList = []

    // A list of generator names to be skipped for this test case
    const generatorSwitches = testcaseDefinition.createGeneratorSwitches()

    for (let i = 0; i < rootNodeList.length; i++) {
      const node = rootNodeList[i]

      // Hat eine referenzierte Node ein neverExecute=true ?

      if (rootNodeList.length > 1) {
        // In this case we need to add a modifier to the test case name
        node.testcaseName = `${testcaseDefinition.name}-${i + 1}`
      }

      const callTree = this._buildCallTree(node)

      if (
        !this._isNeverExecute(callTree) &&
        this._isFilterOk({ testcaseDefinition, callTree })
      ) {
        this._recreateInstanceIds(node)
        const tcData = new TestcaseData({
          tableName: node.tableName,
          name: node.testcaseName,
          instanceId: node.instanceId,
          callTree,
        })

        await this._generateData(tcData, node, generatorSwitches)
        tcList.push(tcData)
      }
    }

    return tcList
  }

  /**
   * Returns false if this test case has a filter and the test case does not
   * match the filter criteria
   * @param testcaseDefinition {object} The Testcase definition to be executed
   * @param callTree {object} The RootObject of the callTree
   * @return testcaseDataList {array} An array TestcaseData Objects
   */
  _isFilterOk({ callTree, testcaseDefinition }) {
    const allTags = this._getTags(callTree)
    const allFilter = testcaseDefinition.createFilter()

    let isFilterOk = true

    // No Filter, no problems
    if (allFilter.length > 0 && allTags.length > 0) {
      // If more then one filter is defined, the filter are AND connected
      for (const filterDef of allFilter) {
        const filterProcessorName = filterDef.filterProcessorName
        const expression = filterDef.expression

        const filterProcessor = this.getFilterProcessor(filterProcessorName)
        if (filterProcessor !== undefined) {
          if (!filterProcessor.filter(allTags, expression)) {
            isFilterOk = false
            break
          }
        }
      }
    }

    return isFilterOk
  }

  /**
   * Iterates through the call tree and checks if there is an element with neverExceute=true
   * @param callTree {object} The RootObject of the callTree
   * @return neverExecute {boolean} true, if one child object has neverExecute=true
   */
  _isNeverExecute(callTree) {
    function iterate(rootObj) {
      if (rootObj.neverExecute) {
        return true
      }

      for (const obj of rootObj.children) {
        if (obj.neverExecute) {
          return true
        }
        if (iterate(obj)) {
          return true
        }
      }
      return false
    }

    if (iterate(callTree)) {
      return true
    }

    return false
  }

  /**
   * Get all the tags of all the nodes in one array back.
   * @param callTree {object} Das RootObject des callTrees
   * @return tags {array} an array with all the tags
   */
  _getTags(callTree) {
    const tags = []
    function iterate(rootObj) {
      rootObj.tags.forEach((tag) => {
        tags.push(tag)
      })

      for (const obj of rootObj.children) {
        iterate(obj)
      }
    }

    iterate(callTree)
    return tags
  }

  /**
   * Builds the call tree for this test case data object.
   * This tree could be used to create the test case names
   * or what ever you need
   * @param node {objec} The parent node
   * @return callTreeObject {object} An object representing this node
   */
  _buildCallTree(node) {
    const children = []

    // now follow the references
    for (const fieldName of Object.keys(node.references)) {
      const ref = node.references[fieldName]
      if (!ref.selfReference) {
        const childNode = this._buildCallTree(ref.target)
        children.push(childNode)
      }
    }

    return {
      instanceId: node.instanceId,
      tableName: node.tableName,
      testcaseName: node.testcaseName,
      neverExecute: node.neverExecute,
      tags: node.tags,
      children,
    }
  }

  /**
   * Generates the test case data for a node.
   * Also calls recursively all the referenced nodes for data
   * creation. The created data is stored in the given testcaseData
   * object.
   * @param testcaseData {object} The testcase data object for storing the data
   * @param node {object} The node to create the data for
   * @param generatorSwitches {array} A list of generator names to be skipped
   */
  async _generateData(testcaseData, node, generatorSwitches) {
    /**
     * Deletes all the entries of the array which are undefined
     * @param data {array} The array to be cleaned
     * @return newData {array} A new array only containing the defined entries
     */
    function cleanArray(data) {
      const newData = []
      for (const d of data) {
        if (d !== undefined) {
          newData.push(d)
        }
      }
      return newData
    }

    const todosStatic = node.todosStatic
    const todosMeta = node.todosMeta
    let todosReference = node.todosReference

    // filter for generators which are switched off
    let todosGenerator = node.todosGenerator.filter(
      (genTodo) => !generatorSwitches.includes(genTodo.generatorName)
    )

    this.writeStaticData(testcaseData, todosStatic)
    this.writeMetaData(testcaseData, todosMeta)

    let changeCount = 0
    do {
      changeCount = 0
      changeCount += await this._executeGeneratorTodos(
        testcaseData,
        todosGenerator
      )

      changeCount += this._executeReferenceTodos(testcaseData, todosReference)
      todosReference = cleanArray(todosReference)
      todosGenerator = cleanArray(todosGenerator)
    } while (
      (todosGenerator.length > 0 || todosReference.length > 0) &&
      changeCount > 0
    )

    if (todosGenerator.length > 0 || todosReference.length > 0) {
      const header = `tableName -> testcaseName -> fieldName -> (generatorName)`
      const data = []
      for (const todo of todosGenerator) {
        data.push(
          `Generator: ${todo.tableName} -> ${todo.testcaseName} -> ${todo.fieldName} -> ${todo.generatorName}`
        )
      }
      for (const todo of todosReference) {
        data.push(
          `Reference: ${todo.tableName} -> ${todo.testcaseName} -> ${todo.fieldName}`
        )
      }

      await this.logger.error({
        header,
        message: `Could not resolve all the fields`,
        details: data.join('\n'),
      })
    }
  }

  /**
   * Calls the generator and stores the data in the data object.
   * Important: When calling a generator with an instanceId suffix then
   * this is only for the generator. The data will be stored using the
   * instanceId of the node.
   * @param testcaseData {object} The testcase data object for storing the data
   * @param generatorTodos {array} An array of generator todos
   * @return changeCount {number} The number of succesful generator calls
   */
  async _executeGeneratorTodos(testcaseData, generatorTodos) {
    let changeCount = 0

    for (let i = 0; i < generatorTodos.length; i++) {
      const todo = generatorTodos[i]
      const instanceId = todo.node.instanceId

      const generator = this.generatorRegistry.getGenerator(todo.generatorName)

      // the instance id used for the generator
      const genInstanceId = todo.instanceIdSuffix
        ? `${todo.node.instanceId} : ${todo.instanceIdSuffix}`
        : todo.node.instanceId

      // const data = await generator.generate(genInstanceId, testcaseData, todo)
      let data
      try {
        data = await generator.generate(genInstanceId, testcaseData, todo)
      } catch (e) {
        await this.logger.error({
          message: e.message,
          meta: todo.metaInformation,
          stack: e.stack,
        })
        throw e
      }

      if (data !== undefined) {
        // the instanceId to store the data is the instanceId of the TestcaseData
        // object.

        const tableName = todo.tableName
        const fieldName = todo.fieldName

        if (testcaseData.data[tableName] === undefined) {
          testcaseData.data[tableName] = {}
        }
        if (testcaseData.data[tableName][instanceId] === undefined) {
          testcaseData.data[tableName][instanceId] = {}
        }

        testcaseData.data[tableName][instanceId][fieldName] = data

        changeCount++
        // delete the entry if the work is done
        generatorTodos[i] = undefined

        // erzeugt die postProcess todos
        // const postProcessTodos = await generator.createPostProcessTodos(
        //   genInstanceId,
        //   testcaseData,
        //   todo
        // )

        let postProcessTodos
        try {
          postProcessTodos = await generator.createPostProcessTodos(
            genInstanceId,
            testcaseData,
            todo
          )
        } catch (e) {
          await this.logger.error({
            message: e.message,
            meta: todo.metaInformation,
            stack: e.stack,
          })
          throw e
        }

        if (postProcessTodos !== undefined) {
          for (const postProcessTodo of postProcessTodos) {
            // The todo for postprocessing will only be stoted if data was created
            testcaseData.postProcessTodos.push(postProcessTodo)
          }
        }
      }
    }

    return changeCount
  }

  /**
   *
   * @param testcaseData {object} The testcase data object for storing the data
   * @param generatorTodos {array} An array of generator todos
   * @return changeCount {number} The number of succesful generator calls
   */
  _executeReferenceTodos(testcaseData, referenceTodos) {
    let changeCount = 0
    for (let i = 0; i < referenceTodos.length; i++) {
      const ref = referenceTodos[i]
      const targetTableName = ref.targetTableName
      const targetFieldName = ref.targetFieldName

      if (targetFieldName === undefined || targetFieldName === '') {
        // If no fieldName is given this reference will be resolved
        // on the first call. These kind of references are usefull to
        // let the generators in these testcases to the work
        changeCount++
        referenceTodos[i] = undefined
      } else {
        // const refInstanceId = ref.instanceIdSuffix
        //   ? `${ref.instanceId}:${ref.instanceIdSuffix}`
        //   : ref.instanceId
        const refInstanceId = ref.target.instanceId

        if (
          testcaseData.data[targetTableName] !== undefined &&
          testcaseData.data[targetTableName][refInstanceId][targetFieldName] !==
            undefined
        ) {
          // ok, the data was created
          const parentTableName = ref.tableName
          const parentFieldName = ref.fieldName
          const parentNode = ref.parent
          const instanceId = parentNode.instanceId

          const data =
            testcaseData.data[targetTableName][refInstanceId][targetFieldName]

          if (testcaseData.data[parentTableName] === undefined) {
            testcaseData.data[parentTableName] = {}
          }
          if (testcaseData.data[parentTableName][instanceId] === undefined) {
            testcaseData.data[parentTableName][instanceId] = {}
          }

          testcaseData.data[parentTableName][instanceId][parentFieldName] = data

          changeCount++
          referenceTodos[i] = undefined
        }
      }
    }

    return changeCount
  }

  /**
   * This method creates the node trees for one testcaseDefinition
   * @param testcaseDefinition {object} The Testcase definition to be executed
   * @return nodes {array} The new nodes created
   */
  async createNodeTree(testcaseDefinition) {
    const todos = testcaseDefinition.createTodos()

    const tags = testcaseDefinition.createTags()

    // This is a root node.
    const node = new Node({
      tableName: testcaseDefinition.tableName,
      tableType: testcaseDefinition.tableType,
      testcaseName: testcaseDefinition.name,
      todos,
      meta: testcaseDefinition.metaInformation,
      tags,
    })

    const nodeList = await this._explodeNodeReferences(node)
    return nodeList
  }

  /**
   * If the nodes are exploded we have copied instanceIDs.
   * So we need to recreate the instanceIds for all the rootNodes
   * to make sure there are unique
   * @param node {object} The node object to change the instanceIds
   * @param idMap {object} An object containing the newly mapped Ids. (Empty for the root node)
   * @param done {Set} A set containing all the already translated IDs
   */
  _recreateInstanceIds(node, idMap = {}, done = new Set()) {
    function setObjectInstanceId(obj) {
      if (done.has(obj.instanceId)) {
        // nothing todo, this id is a new one
        return
      }
      if (idMap[obj.instanceId] === undefined) {
        const newInstId = uuidv4()
        done.add(newInstId)
        idMap[obj.instanceId] = newInstId
        obj.instanceId = newInstId
      } else {
        const newInstId = idMap[obj.instanceId]
        obj.instanceId = newInstId
      }
    }

    setObjectInstanceId(node)

    // now follow the references
    for (const fieldName of Object.keys(node.references)) {
      const ref = node.references[fieldName]
      setObjectInstanceId(ref)
      if (!ref.selfReference) {
        this._recreateInstanceIds(ref.target, idMap, done)
      }
    }
  }

  /**
   * Traverses the references of this node. Just update the node with the references
   * @param node {object} The raw node with the unexpanded references
   * @return nodeList {array} An Array with the nodes created by the references
   */
  async _explodeNodeReferences(node) {
    if (node.todos.reference.length === 0) {
      // if there are no references we just return the node as an array
      return [node]
    }

    const selfReferences = []
    const referenceIdsForCartesian = []
    const nodeList = []

    // used to check if there are references pointing to the same node
    const referenceSet = new Set()

    // stores all the references by there ID
    const referenceMap = {}

    for (const referenceCmd of node.todos.reference) {
      const targetTestcaseName = referenceCmd.targetTestcaseName
      const targetTableName = referenceCmd.targetTableName || node.tableName
      const targetTable = this.tables[targetTableName]
      if (targetTable === undefined) {
        // This table does not exists

        await this.logger.error({
          tableName: node.tableName,
          testcaseName: node.testcaseName,
          message: `The targetTable '${targetTableName}' does not exists`,
        })
      } else {
        const testcaseNames = targetTable.processRanges(targetTestcaseName)

        const fieldReferenceIds = []

        for (const tcName of testcaseNames) {
          const reference = new Reference({
            ...referenceCmd,
            tables: this.tables,
            processorRegistry: this.processorRegistry,
            targetTableType: targetTable.tableType,
          })

          if (targetTestcaseName !== tcName) {
            // this is a range
            // if there is a range the instanceIdSuffix does not work. so it must not be defined
            if (
              referenceCmd.instanceIdSuffix !== undefined &&
              referenceCmd.instanceIdSuffix !== ''
            ) {
              await this.logger.error({
                tableName: node.tableName,
                testcaseName: node.testcaseName,
                message: `If the reference is a range, the instanceIdSuffix must be null`,
                details: referenceCmd,
              })
            }
          }

          // creates the instanceId for this reference
          const instanceIdForReference = node.createReferenceInstanceId(
            referenceCmd
          )
          reference.instanceId = instanceIdForReference

          if (referenceSet.has(instanceIdForReference)) {
            // this is an already existing reference. It could be handled the same way as
            // a self reference
            selfReferences.push(reference)
            referenceMap[reference.id] = reference
          } else {
            // this is a new Reference
            referenceSet.add(instanceIdForReference)

            if (node.isSelfReference(referenceCmd)) {
              reference.selfReference = true
              reference.parent = node
              reference.target = node
              selfReferences.push(reference)
              referenceMap[reference.id] = reference
            } else {
              // process the reference target and get the target nodes
              const targetTestcaseDefinition = targetTable.getTestcaseForName(
                tcName
              )
              targetTestcaseDefinition.logger = this.logger

              let targetNodes = []

              targetNodes = await this.createNodeTree(targetTestcaseDefinition)
              for (const targetNode of targetNodes) {
                const newRef = reference.clone()
                referenceMap[newRef.id] = newRef
                newRef.target = targetNode
                targetNode.instanceId = newRef.instanceId
                fieldReferenceIds.push(newRef.id)

                if (targetTestcaseDefinition.neverExecute) {
                  targetNode.neverExecute = true
                }
              }
            }
          }
        }

        // If there are only self references the list could be empty
        if (fieldReferenceIds.length > 0) {
          referenceIdsForCartesian.push(fieldReferenceIds)
        }
      }
    }

    // free some memory
    node.todos.reference = []

    // --------------------------------------
    // Build the cartesian product
    // --------------------------------------
    if (referenceIdsForCartesian.length > 0) {
      const referenceIdMatrix = cartesianProduct(...referenceIdsForCartesian)
      for (let refIds of referenceIdMatrix) {
        // create a new parent node
        const newNode = node.clone()
        nodeList.push(newNode)

        if (!Array.isArray(refIds)) {
          // make an array
          refIds = [refIds]
        }

        for (const refId of refIds) {
          const ref = referenceMap[refId]
          const newRef = ref.clone(true)
          // newRef.target = ref.target.clone(true)
          newNode.addReference(newRef)

          // The target node always has the same instanecId as the reference
          newRef.target.instanceId = newRef.instanceId
        }
      }
    } else {
      nodeList.push(node)
    }

    // --------------------------------------
    // add the self references to each node
    // --------------------------------------
    for (const n of nodeList) {
      for (const selfRef of selfReferences) {
        const newRef = selfRef.clone()
        newRef.parent = n
        newRef.target = n
        n.addReference(newRef)
      }
    }

    return nodeList
  }
}
