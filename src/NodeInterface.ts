import {
  MetaTestcase,
  TestcaseTodosInterface,
  TodoReferenceInterface
} from '@xhubiotable/model'
import { NodeTodoGeneratorInterface } from './NodeTodoGeneratorInterface'
import { NodeTodoFieldInterface } from './NodeTodoFieldInterface'
import { NodeTodoReferenceInterface } from './NodeTodoReferenceInterface'
import { NodeTodoStaticInterface } from './NodeTodoStaticInterface'
import { Reference } from './Reference'

/**
 * Groups todos by their type for a node.
 *
 * This type defines the structure for storing todos, grouped into:
 * - generator todos
 * - static todos
 * - reference todos
 * - field (meta) todos
 */
export type NodeTodosType = {
  /** Array of generator todos */
  generator: NodeTodoGeneratorInterface[]
  /** Array of static todos */
  static: NodeTodoStaticInterface[]
  /** Array of reference todos */
  reference: NodeTodoReferenceInterface[]
  /** Array of field (meta) todos */
  field: NodeTodoFieldInterface[]
}

/**
 * Options for constructing a Node instance.
 */
export interface NodeInterfaceOptions {
  /**
   * Meta information for the test case associated with this node.
   */
  testcaseMeta: MetaTestcase
  /**
   * An optional initial set of todos for the node.
   */
  todos?: NodeTodosType
  /**
   * Indicates if this test case should never be executed.
   * Such test cases only provide data for other test cases.
   */
  neverExecute?: boolean
  /**
   * An array of tags associated with this test case.
   */
  tags?: string[]
}

/**
 * Public interface for a Node in the data generation graph.
 *
 * A Node represents a single test case in the generation process.
 * It stores its own todos, references, and caching data for clones and instance IDs.
 * The interface defines properties and methods for managing these elements.
 */
export interface NodeInterface {
  /** A unique identifier for this node instance. */
  instanceId: string

  /** Optional instance identifier for references. */
  refInstanceId?: string

  /**
   * Stores the referenced nodes, keyed by their field name.
   * This mapping allows quick access to referenced nodes.
   */
  references: Record<string, Reference>

  /** Raw todos grouped by type. */
  todos: TestcaseTodosInterface

  /** Caches references by their instanceId. */
  refCache: Record<string, Reference>

  /** Caches generated instanceIds by instanceId suffix. */
  instanceIdCache: Record<string, string>

  /** Meta information for the test case associated with this node. */
  testcaseMeta: MetaTestcase

  /** Indicates whether this test case should never be executed. */
  neverExecute: boolean

  /** Array of tags associated with this test case, used for filtering. */
  tags: string[]

  /**
   * Gets the aggregated generator todos for this node.
   * @returns An array of NodeTodoGeneratorInterface items.
   */
  readonly todosGenerator: NodeTodoGeneratorInterface[]

  /**
   * Gets the aggregated reference todos for this node.
   * @returns An array of NodeTodoReferenceInterface items.
   */
  readonly todosReference: NodeTodoReferenceInterface[]

  /**
   * Gets the aggregated static todos for this node.
   * @returns An array of NodeTodoStaticInterface items.
   */
  readonly todosStatic: NodeTodoStaticInterface[]

  /**
   * Gets the aggregated field (meta) todos for this node.
   * @returns An array of NodeTodoFieldInterface items.
   */
  readonly todosField: NodeTodoFieldInterface[]

  /**
   * Creates a unique instanceId for a reference.
   * @param referenceCmd - The reference command containing instanceIdSuffix and other details.
   * @returns A unique instanceId string for the reference.
   */
  createReferenceInstanceId(referenceCmd: TodoReferenceInterface): string

  /**
   * Checks if the given reference command represents a self-reference.
   * @param referenceCmd - The reference command to check.
   * @returns True if it is a self-reference; otherwise, false.
   */
  isSelfReference(referenceCmd: TodoReferenceInterface): boolean

  /**
   * Adds a reference to this node.
   * @param reference - The Reference object to add.
   */
  addReference(reference: Reference): void

  /**
   * Creates a clone of this node.
   * @param recursive - If true, clones referenced nodes recursively; otherwise, clones only this node.
   * @returns A cloned NodeInterface instance.
   */
  clone(recursive?: boolean): NodeInterface

  /**
   * Retrieves a clone for the specified node.
   * If the node has already been cloned for this parent, returns the cached clone.
   * Otherwise, clones the node, caches it, and returns the clone.
   * @param nodeToClone - The node to be cloned.
   * @returns The clone of the provided node.
   */
  getCloneFor(nodeToClone: NodeInterface): NodeInterface
}
