import BfsCursor from './internal/bfs-cursor'
import Context from './internal/context'
import Flags from './internal/flags'
import Queue from './internal/queue'
import {
  isNotEmpty
} from './internal/util'

export default function bfs(root, iteratee, getChildren) {
  const flags = Flags()
  const cursor = BfsCursor()
  const context = Context(flags, cursor)
  const queue = Queue(root)

  while (!queue.isEmpty()) {
    let node = queue.dequeue()

    flags.reset()

    iteratee(node, context)

    if (flags.break) break

    if (!flags.remove) {
      cursor.moveNext()

      if (flags.replace) {
        node = flags.replace
      }

      if (!flags.skip) {
        const children = getChildren(node)
        if (isNotEmpty(children)) {
          queue.enqueueMultiple(children)
          cursor.store(node, children.length)
        }
      }
    }

    cursor.moveForward()
  }
}
