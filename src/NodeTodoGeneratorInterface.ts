import { TodoGeneratorInterface } from '@xhubiotable/model'
import { NodeInterface } from './NodeInterface'

/**
 * Defines the todo for calling a generator.
 * When processing a table all the generator calls are collected
 * in a list of Todos.
 * Then the list of todos will be executed untill each generator has generated
 * its data.
 */
export interface NodeTodoGeneratorInterface extends TodoGeneratorInterface {
  /** The node this Todo is generated from */
  node: NodeInterface
}
