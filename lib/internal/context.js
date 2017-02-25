function Context(flags, cursor) {
  this.flags = flags
  this.cursor = cursor
}

Context.prototype = {
  break() {
    this.flags.break = true
  },

  skip() {
    this.flags.skip = true
  },

  remove() {
    this.flags.remove = true
  },

  replace(node) {
    this.flags.replace = node
  },

  get parent() {
    return this.cursor.parent
  },

  get depth() {
    return this.cursor.depth
  },

  get level() {
    return (this.cursor.depth + 1)
  },

  get index() {
    return this.cursor.index
  }
}

export default function ContextFactory(flags, cursor) {
  return new Context(flags, cursor)
}
