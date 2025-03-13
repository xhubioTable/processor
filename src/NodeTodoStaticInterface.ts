import { TodoStaticInterface } from '@tlink/model'
import { NodeInterface } from './NodeInterface'

/**
 * Defines the todo for static values
 */
export interface NodeTodoStaticInterface extends TodoStaticInterface {
  /** The node this Todo is generated from */
  node: NodeInterface
}
