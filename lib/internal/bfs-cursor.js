import Queue from './queue'

function BfsCursor() {
  this.depth = 0
  this.index = -1
  this.queue = Queue({ node: null, arity: 1 })
  this.levelNodes = 1
  this.nextLevelNodes = 0
}

BfsCursor.prototype = {
  store(node, arity) {
    this.queue.enqueue({ node, arity })
    this.nextLevelNodes += arity
  },

  moveNext() {
    this.index++
  },

  moveForward() {
    this.queue.peek().arity--
    this.levelNodes--
    if (0 === this.queue.peek().arity) {
      this.index = 0
      this.queue.dequeue()
    }
    if (0 === this.levelNodes) {
      this.depth++
      this.levelNodes = this.nextLevelNodes
      this.nextLevelNodes = 0
    }
  },

  get parent() {
    return this.queue.peek().node
  }
}

export default function CursorFactory() {
  return new BfsCursor()
}
