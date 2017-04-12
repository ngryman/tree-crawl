import Stack from './stack'

function DfsCursor() {
  this.depth = 0
  this.stack = Stack({ node: null, index: -1 })
}

DfsCursor.prototype = {
  moveDown(node) {
    this.depth++
    this.stack.push({ node, index: 0 })
  },

  moveUp() {
    this.depth--
    this.stack.pop()
  },

  moveNext() {
    this.stack.peek().index++
  },

  get parent() {
    return this.stack.peek().node
  },

  get index() {
    return this.stack.peek().index
  }
}

export default function CursorFactory() {
  return new DfsCursor()
}
