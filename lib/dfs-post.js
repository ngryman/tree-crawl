import Context from './internal/context'
import DfsCursor from './internal/dfs-cursor'
import Flags from './internal/flags'
import Stack from './internal/stack'
import {
  isNotEmpty
} from './internal/util'

export default function dfsPost(root, iteratee, getChildren) {
  const flags = Flags()
  const cursor = DfsCursor()
  const context = Context(flags, cursor)
  const stack = Stack(root)
  // perf: avoid bounds check deopt when calling Queue#peek later,
  // instead we put an initial value
  const ancestors = Stack(null)

  while (!stack.isEmpty()) {
    const node = stack.peek()
    const parent = ancestors.peek()
    const children = getChildren(node)

    flags.reset()

    if (node === parent || !isNotEmpty(children)) {
      if (node === parent) {
        ancestors.pop()
        cursor.moveUp()
      }

      stack.pop()

      iteratee(node, context)

      if (flags.break) break
      if (flags.remove) continue

      cursor.moveNext()
    }
    else {
      ancestors.push(node)
      cursor.moveDown(node)
      stack.pushArrayReverse(children)
    }
  }
}
