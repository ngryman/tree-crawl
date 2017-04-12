const Queue = require('./queue')

let nextValue = 0

const createNode = () =>
  ({ v: nextValue++, c: [] })

function tree(arity, levels) {
  const root = createNode()
  const queue = Queue(root)

  let level = 1
  let nodesLeft = arity

  while (level < levels) {
    const node = queue.dequeue()
    for (let i = 0; i < arity; i++) {
      const child = createNode()
      node.c.push(child)
      queue.enqueue(child)
    }

    nodesLeft -= arity
    if (0 === nodesLeft) {
      level++
      nodesLeft = Math.pow(arity, level)
    }
  }

  return root
}

module.exports = tree
