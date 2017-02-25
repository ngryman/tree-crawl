import Context from './internal/context'
import DfsCursor from './internal/dfs-cursor'
import Flags from './internal/flags'
import Stack from './internal/stack'
import {
  isNotEmpty
} from './internal/util'

export default function dfsPre(root, iteratee, getChildren) {
  const flags = Flags()
  const cursor = DfsCursor()
  const context = Context(flags, cursor)
  const stack = Stack(root)

  // perf: use same hidden class than root node in order to
  // keep the stack monomorphic
  const dummy = Object.assign({}, root)

  while (!stack.isEmpty()) {
    let node = stack.pop()

    if (node === dummy) {
      cursor.moveUp()
      continue
    }

    flags.reset()

    iteratee(node, context)

    if (flags.break) break
    if (flags.remove) continue

    cursor.moveNext()

    if (!flags.skip) {
      if (flags.replace) {
        node = flags.replace
      }

      const children = getChildren(node)
      if (isNotEmpty(children)) {
        stack.push(dummy)
        stack.pushArrayReverse(children)
        cursor.moveDown(node)
      }
    }
  }
}
