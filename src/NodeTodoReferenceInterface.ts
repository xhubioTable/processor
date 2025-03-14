import { TodoReferenceInterface } from '@xhubiotable/model'
import { NodeInterface } from './NodeInterface'

/**
 * Defines the todo for a refernce. A reference points
 * to a test case in a different table.
 */
export interface NodeTodoReferenceInterface extends TodoReferenceInterface {
  /** The node this Todo is generated from */
  targetNode: NodeInterface

  parentNode: NodeInterface
}
