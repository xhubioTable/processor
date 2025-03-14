import { TodoFieldInterface } from '@xhubiotable/model'
import { NodeInterface } from './NodeInterface'

/** Defines the common data for all the todos. */
export interface NodeTodoFieldInterface extends TodoFieldInterface {
  /** The node this Todo is generated from */
  node: NodeInterface
}
